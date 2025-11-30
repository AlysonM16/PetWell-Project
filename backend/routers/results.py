from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import LabResult
from ..schemas import LabResultOut
from ..security import get_current_user

router = APIRouter(prefix="/results", tags=["results"])

@router.get("/patient/{patient_id}", response_model=list[LabResultOut])
def get_results_for_patient(patient_id: int, db: Session = Depends(get_db)):
    results = db.query(LabResult).filter_by(patient_id=patient_id).all()
    return results
