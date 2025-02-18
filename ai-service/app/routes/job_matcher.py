from fastapi import APIRouter
from pydantic import BaseModel
from services.job_matcher.hybrid_matcher import compute_similarity

router = APIRouter()

class UserInput(BaseModel):
    skills: list[str]
    experience: int
    jobs: list[dict]  # List of {"job_id": str, "description": str}

@router.post("/")
def get_matched_jobs(user: UserInput):
    # job=HybridMatcher()
    matched_jobs = compute_similarity(user.skills, user.experience, user.jobs)
    return {"matched_jobs": matched_jobs}
