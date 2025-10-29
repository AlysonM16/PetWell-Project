import pathlib
import io
import pymupdf4llm
import pymupdf
from PIL import Image
import pytesseract
import google.generativeai as genai
import time


# ----------------------------
# 1. Convert PDF to markdown
# ----------------------------
def pdf_to_markdown(pdf_path: str) -> str:
    """Return markdown text from a PDF, with OCR fallback if needed."""
    md_text = pymupdf4llm.to_markdown(pdf_path)
    if md_text.strip():
        return md_text

    print("No text detected, running OCR fallback ...")
    doc = pymupdf.open(pdf_path)
    ocr_text = []
    for i, page in enumerate(doc):
        pix = page.get_pixmap()
        img = Image.open(io.BytesIO(pix.tobytes("png")))
        text = pytesseract.image_to_string(img)
        ocr_text.append(f"# Page {i + 1}\n\n{text.strip()}\n\n---\n\n")
    return "".join(ocr_text)


# ----------------------------
# 2. Send to Gemini
# ----------------------------
def extract_medical_data_with_gemini(api_key: str, markdown_text: str):
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(model_name="models/gemini-2.5-flash-lite")

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

    response = model.generate_content([prompt, markdown_text])
    print(time.process_time())
    return response.text


# ----------------------------
# 3. Main driver
# ----------------------------
def main():
    api_key = "AIzaSyAf27if0_zhCI-Z21r4xjFGIJdAE9P3nx0"
    pdf_path = "lab2_Redacted.pdf"
    output_md = "lab2_Redacted_output.md"

    # Convert PDF
    md_text = pdf_to_markdown(pdf_path)
    pathlib.Path(output_md).write_text(md_text, encoding="utf-8")
    print(f"Markdown saved to {output_md}  after ", time.process_time(), " seconds.")

    # Send to AI
    json_result = extract_medical_data_with_gemini(api_key, md_text)
    pathlib.Path("parsed_data2.json").write_text(json_result, encoding="utf-8")
    end = time.time()
    print("Parsed medical data saved to parsed_data.json after ", (end - start), " seconds.")



if __name__ == "__main__":
    start = time.time()
    main()
