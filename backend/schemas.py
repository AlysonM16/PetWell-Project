from pydantic import BaseModel, EmailStr, Field
from datetime import datetime, date
from typing import Optional


# =========================
# USER MODELS
# =========================

class UserBase(BaseModel):
    name: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        from_attributes = True


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"



# =========================
# UNITS (mg/dL, U/L, etc.)
# =========================

class UnitBase(BaseModel):
    symbol: str
    name: str


class UnitCreate(UnitBase):
    pass


class UnitOut(UnitBase):
    id: int

    class Config:
        from_attributes = True



# =========================
# ANALYTES (GLU, CREA, BUN/CREA)
# =========================

class AnalyteBase(BaseModel):
    code: str                      # "GLU", "CREA"
    name: str                      # "Glucose", etc.
    default_unit_id: Optional[int] # ratios = None
    is_ratio: bool = False


class AnalyteCreate(AnalyteBase):
    pass


class AnalyteOut(AnalyteBase):
    id: int

    class Config:
        from_attributes = True



# =========================
# REFERENCE RANGES
# =========================

class ReferenceRangeBase(BaseModel):
    analyte_id: int
    sex: Optional[str] = None               # M/F/Unknown
    species: Optional[str] = None           # Dog, Cat, etc.
    age_min_years: float
    age_max_years: float
    lower_bound: Optional[float] = None
    upper_bound: Optional[float] = None
    unit_id: Optional[int] = None
    notes: Optional[str] = None


class ReferenceRangeCreate(ReferenceRangeBase):
    pass


class ReferenceRangeOut(ReferenceRangeBase):
    id: int

    class Config:
        from_attributes = True



# =========================
# PATIENTS
# =========================

class PatientBase(BaseModel):
    external_id: Optional[str] = None
    first_name: str
    last_name: str
    dob: date
    sex: Optional[str] = None
    species: Optional[str] = None


class PatientCreate(PatientBase):
    pass


class PatientOut(PatientBase):
    id: int

    class Config:
        from_attributes = True



# =========================
# LAB EVENTS (1 lab visit)
# =========================

class LabBase(BaseModel):
    patient_id: int
    collected_at: datetime
    ordering_provider: Optional[str] = None
    source_lab: Optional[str] = None
    notes: Optional[str] = None


class LabCreate(LabBase):
    pass


class LabOut(LabBase):
    id: int

    class Config:
        from_attributes = True



# =========================
# LAB RESULTS (each analyte)
# =========================

class LabResultBase(BaseModel):
    lab_id: int
    analyte_id: int

    value_numeric: Optional[float] = None
    value_text: Optional[str] = None

    unit_id: Optional[int] = None  # None for ratio analytes
    reference_range_id: Optional[int] = None
    abnormal_flag: Optional[str] = None

    measured_at: Optional[datetime] = None
    created_at: Optional[datetime] = None


class LabResultCreate(LabResultBase):
    """
    Validates the rule:
    - Either value_numeric OR value_text must be present, not both null.
    """

    def validate(self):
        if self.value_numeric is None and self.value_text is None:
            raise ValueError("Either numeric or text value must be provided.")


class LabResultOut(LabResultBase):
    id: int

    class Config:
        from_attributes = True
