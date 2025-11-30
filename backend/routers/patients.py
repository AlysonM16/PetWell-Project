from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Patient
from ..schemas import PatientCreate, PatientOut
from ..security import get_current_user

router = APIRouter(prefix="/patients", tags=["patients"])

@router.get("/by_user/{user_id}", response_model=list[PatientOut])
def get_patients_for_user(user_id: int, db: Session = Depends(get_db)):
    patients = db.query(Patient).filter_by(user_id=user_id).all()
    return patients

@router.get("/{patient_id}", response_model=PatientOut)
def get_single_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).get(patient_id)
    if not patient:
        raise HTTPException(404, "Patient not found")
    return patient

@router.post("/", response_model=PatientOut)
def create_patient(
    payload: PatientCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    patient = Patient(
        name=payload.name,
        age=payload.age,
        user_id=current_user.id
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient
