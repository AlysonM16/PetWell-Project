import os
import time
import google.generativeai as genai
import json
import json_repair
import io
import pymupdf4llm
import pymupdf
from PIL import Image
import pytesseract
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(dotenv_path="backend/.env")

# Configure Google AI API
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY environment variable not set")
genai.configure(api_key=GOOGLE_API_KEY)

def pdf_to_markdown(pdf_path: str) -> str:
    """Return markdown text from a PDF, with OCR fallback if needed."""
    md_text = pymupdf4llm.to_markdown(pdf_path)
    if md_text.strip():
        return md_text

    print("No text detected, running OCR")
    doc = pymupdf.open(pdf_path)
    ocr_text = []
    for i, page in enumerate(doc):
        pix = page.get_pixmap(dpi=300)
        img = Image.open(io.BytesIO(pix.tobytes("png"))).convert("L")
        text = pytesseract.image_to_string(img, config="--psm 3")
        ocr_text.append(f"# Page {i + 1}\n\n{text.strip()}\n\n---\n\n")
    return "".join(ocr_text)

def extract_data_from_pdf(file_path: str) -> dict:
    
    """
    Extract medical data from a markdown version of lab report using Google Gemini API.
    
    Args:
        file_path: Path to the PDF file to process
    
    Returns:
        Parsed JSON data in the specified schema
    
    Raises:
        Exception: If any step in the processing fails
    """
    
    # Convert PDF to markdown file
    pdf_to_markdown(file_path)
    
    start_time = time.time()
    try:
        # 1. Create the model with a fixed prompt to save time
        model = genai.GenerativeModel(
            model_name="models/gemini-2.5-flash-lite",
            system_instruction="""
            You are an expert medical data extraction assistant with an IQ of 140. Analyze the attached markdown lab report as quickly and accurately as possible.
            Your task is to extract all medical tests, their values, units, and reference ranges,
            grouping them by the visit date. Additionally, take note of any important information such as irregular values or failed tests and include this
            in the 'notes' field. Anything the owner should be warned about should be in this 'notes' field in under 150 characters.
    
            Your output MUST be a single, valid JSON object and nothing else.
    
            The required JSON schema is:
            {
                "visits": [
                    {
                        "visit_date": "YYYY-MM-DD",
                        "records": [
                            {
                                "test_name": "string",
                                "value": "float or string",
                                "unit": "string",
                                "reference_range": "string"
                            }
                        ]
                        "notes": "Note 1:, Note 2:, Note 3:, etc.",
                    }
                ]
            }

            If a date is not found, use 'unknown'. (One tip to find the date of a certain visit, is when it was ordered. If there is a date after a field
            called 'Ordered:' or 'Ordered on:' that is likely the date of the visit) Ensure all extracted values are accurate and complete.
            """
        )
               
        
        # 2. Upload the file to Google AI
        uploaded_file = genai.upload_file(path=file_path)
        
        # 2. Call the model with the prompt and the file
        response = model.generate_content([uploaded_file])
        
        # 3. Clean up the uploaded file
        genai.delete_file(uploaded_file.name)
        
        # 4. Clean and parse the JSON response
        try:
            # Clean the response text if it's wrapped in a markdown code block
            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:-3].strip()
            elif text.startswith("```"):
                text = text[3:-3].strip()
            
            return json.loads(text)
        except json.JSONDecodeError as e:
            try:
                # Attempt to repair malformed JSON
                repaired = json_repair.repair_json(text)
                return json.loads(repaired)
            except Exception as repair_err:
                raise ValueError(f"Failed to parse model response as JSON: {e}\nRepair attempt failed: {repair_err}\nResponse: {text}")
            
    except Exception as e:
        # Attempt to clean up if upload was successful but processing failed
        if 'uploaded_file' in locals():
            try:
                genai.delete_file(uploaded_file.name)
            except:
                pass
        raise Exception(f"PDF processing failed: {str(e)}")
    finally:
        elapsed = time.time() - start_time
        print(f"PDF extraction for {file_path} took {elapsed:.2f} seconds")
