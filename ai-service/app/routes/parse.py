# app/routes/parser.py
from fastapi import APIRouter, File, UploadFile
from services.resume_parser.file_processor import extract_text
from services.resume_parser.skill_extractor import extract_skills
from services.resume_parser.experience_extractor import extract_experience

router = APIRouter()

@router.post("/")
async def parse_resume(file: UploadFile = File(...)):
    text = extract_text(await file.read(), file.content_type)
    return {
        "skills": extract_skills(text),
        "experience": extract_experience(text)
    }