import os
import time
import google.generativeai as genai
import json
import json_repair
from dotenv import load_dotenv
from PIL import Image
import io
import pymupdf
import pytesseract
import pymupdf4llm

# Load env
load_dotenv(dotenv_path="backend/.env")
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY') or "dummy_key_for_local_testing"
genai.configure(api_key=GOOGLE_API_KEY)


def extract_data_from_pdf(file_path: str) -> dict:
    """
    Extract lab data from PDF and send to Gemini API safely.
    """
    # --- Convert PDF to markdown text ---
    md_text = pymupdf4llm.to_markdown(file_path)
    if md_text.strip():
        markdown_text = md_text
    else:
        # Fallback: OCR
        print("No text detected, running OCR")
        doc = pymupdf.open(file_path)
        pages_text = []
        for i, page in enumerate(doc):
            pix = page.get_pixmap(dpi=300)
            img = Image.open(io.BytesIO(pix.tobytes("png"))).convert("L")
            text = pytesseract.image_to_string(img, config="--psm 3")
            pages_text.append(f"# Page {i + 1}\n\n{text.strip()}\n\n---\n\n")
        markdown_text = "".join(pages_text)

    # --- Write markdown to a temporary file safely ---
    tmp_path = "markdown_file.md"
    with open(tmp_path, "w", encoding="utf-8") as f:
        f.write(markdown_text)
        f.flush()  # ensure all content is written
        os.fsync(f.fileno())  # force write to disk

    prompt = """
    You are an expert medical data extraction assistant with an IQ of 140. Analyze the attached PDF lab report as quickly and accurately as possible.
    Your task is to extract all medical tests, their values, units, and reference ranges,
    grouping them by the visit date. Additionally, take note of any important information such as irregular values or failed tests and include this in the 'notes' field. Anything the owner should be warned about should be in this 'notes' field in under 150 characters.
    
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

    If a date is not found, use 'unknown'. (One tip to find the date of a certain visit, is when it was ordered. If there is a date after a field called 'Ordered:' or 'Ordered on:' that is likely the date of the visit) Ensure all extracted values are accurate and complete.
"""

    start_time = time.time()
    uploaded_file = None
    try:
        # Upload file to Google AI
        uploaded_file = genai.upload_file(tmp_path)

        # Call the model
        model = genai.GenerativeModel(model_name="models/gemini-2.5-flash-lite")
        response = model.generate_content([prompt, uploaded_file])

        # Delete uploaded file
        genai.delete_file(uploaded_file.name)

        # Parse JSON
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:-3].strip()
        elif text.startswith("```"):
            text = text[3:-3].strip()

        try:
            return json.loads(text)
        except json.JSONDecodeError:
            repaired = json_repair.repair_json(text)
            return json.loads(repaired)

    except Exception as e:
        if uploaded_file:
            try:
                genai.delete_file(uploaded_file.name)
            except:
                pass
        raise Exception(f"PDF processing failed: {str(e)}")
    finally:
        elapsed = time.time() - start_time
        print(f"PDF extraction for {file_path} took {elapsed:.2f} seconds")
