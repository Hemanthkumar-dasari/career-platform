"""PDF text extraction using pdfplumber."""
import io

import pdfplumber


def extract_text(file_obj) -> str:
    """Extract raw text from PDF file object or bytes. Returns the concatenated text of all pages."""
    text_parts = []
    
    # Ensure we are at the start of the file
    if hasattr(file_obj, "seek"):
        file_obj.seek(0)
    
    # If it's a file-like object, BytesIO can handle it or we can pass it directly to pdfplumber
    with pdfplumber.open(file_obj) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)

    if not text_parts:
        raise ValueError("No readable text found in the PDF. The file may be scanned or image-only.")

    return "\n\n".join(text_parts)
