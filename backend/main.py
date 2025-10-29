from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
import tempfile
import json
from .llm_parser import extract_data_from_pdf

load_dotenv()

from fastapi.staticfiles import StaticFiles

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

from fastapi.responses import FileResponse

# Serve frontend static files Comment out because its not frontend
#app.mount("/static", StaticFiles(directory="frontend"), name="static")

@app.get("/")
async def read_root():
    return {"message": "Hello from FastAPI"}
    #return FileResponse("frontend/index.html")

@app.post("/process-pdf")
async def process_pdf(file: UploadFile = File(...)):
    """
    Process PDF file upload and extract health data
    """
    # Validate file type
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(
            status_code=400,
            detail="File must be a PDF"
        )

    contents = await file.read()
    # Check file size (limit to 10MB)
    max_size = 10 * 1024 * 1024  # 10MB
    if len(contents) > max_size:
        raise HTTPException(
            status_code=400,
            detail="File size exceeds 10MB limit"
        )

    # Save the uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
        temp_file.write(contents)
        temp_file_path = temp_file.name

    try:
        # Process the PDF using the LLM parser
        extracted_data = extract_data_from_pdf(temp_file_path)
        
        return JSONResponse(
            status_code=200,
            content=extracted_data
        )
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="Failed to decode JSON from the LLM response."
        )
    except Exception as e:
        # Log the full error for debugging
        print(f"Error processing PDF: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )
    finally:
        # Ensure the temporary file is deleted
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)