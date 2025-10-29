import os
import time
import google.generativeai as genai
import json
import json_repair
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(dotenv_path="backend/.env")

# Configure Google AI API
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY environment variable not set")
genai.configure(api_key=GOOGLE_API_KEY)

def extract_data_from_pdf(file_path: str) -> dict:
    """
    Extract medical data from a PDF lab report using Google Gemini API.
    
    Args:
        file_path: Path to the PDF file to process
    
    Returns:
        Parsed JSON data in the specified schema
    
    Raises:
        Exception: If any step in the processing fails
    """
    # Define the prompt for the Gemini model
    prompt = """
    You are an expert medical data extraction assistant. Analyze the attached PDF lab report.
    Your task is to extract all medical tests, their values, units, and reference ranges,
    grouping them by the visit date.
    
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
            }
        ]
    }

    If a date is not found, use 'unknown'. Ensure all extracted values are accurate and complete.
    """
    
    start_time = time.time()
    try:
        # 1. Upload the file to Google AI
        uploaded_file = genai.upload_file(path=file_path)
        
        # 2. Call the model with the prompt and the file
        model = genai.GenerativeModel(model_name="models/gemini-2.5-flash")
        response = model.generate_content([prompt, uploaded_file])
        
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