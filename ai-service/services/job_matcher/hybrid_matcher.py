from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def preprocess_text(skill_list):
    return " ".join(skill_list).lower()

def compute_similarity(user_skills, user_experience, jobs):
    """
    Match user skills and experience with job requirements.
    :param user_skills: List of user skills
    :param user_experience: Years of experience
    :param jobs: Dictionary with job_id as key and (required_skills, required_experience) as values
    :return: Sorted job IDs based on similarity score
    """
    vectorizer = TfidfVectorizer()
    
    # Prepare job skill texts
    job_texts = [preprocess_text(job['skills']) for job in jobs]
    user_text = preprocess_text(user_skills)
    
    # Compute TF-IDF vectors
    tfidf_matrix = vectorizer.fit_transform([user_text] + job_texts)
    user_vector = tfidf_matrix[0]
    job_vectors = tfidf_matrix[1:]
    
    # Compute skill similarity
    skill_scores = cosine_similarity(user_vector, job_vectors).flatten()
    
    # Compute experience score (Inverse Difference, higher is better)
    experience_scores = [1 / (1 + abs(user_experience - job["experience"])) for job in jobs]
    
    # Final score (weighted combination of skills & experience)
    final_scores = [0.7 * skill + 0.3 * exp for skill, exp in zip(skill_scores, experience_scores)]
    
    # Rank job IDs based on score
    ranked_jobs = sorted(zip(jobs, final_scores), key=lambda x: x[1], reverse=True)
    
    return ranked_jobs



# def match_jobs(user_skills, user_experience, jobs):
    job_texts = [job["description"] for job in jobs]
    job_ids = [job["job_id"] for job in jobs]

    # Combine skills & experience into user profile text
    user_text = " ".join(user_skills) + f" {user_experience} years experience"

    # TF-IDF Vectorization
    vectorizer = TfidfVectorizer(stop_words="english")
    vectors = vectorizer.fit_transform([user_text] + job_texts)

    # Compute similarity scores
    user_vector = vectors[0]
    job_vectors = vectors[1:]
    scores = cosine_similarity(user_vector, job_vectors)[0]

    # Sort jobs by highest relevance
    ranked_jobs = sorted(zip(job_ids, scores), key=lambda x: x[1], reverse=True)

    return [{"job_id": job[0], "score": round(job[1], 2)} for job in ranked_jobs if job[1] > 0]
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sentence_transformers import SentenceTransformer
# from sklearn.metrics.pairwise import cosine_similarity

# class HybridMatcher:
#     def __init__(self):
#         self.tfidf = TfidfVectorizer(stop_words="english")
#         self.bert_model = SentenceTransformer("all-mpnet-base-v2")

#     def match_jobs(self, user_skills, user_experience, job_data):
#         """
#         Match user skills and experience to job descriptions.

#         :param user_skills: List of user skills
#         :param user_experience: User's experience in years
#         :param job_data: Dictionary of {job_id: job_description}
#         :return: Sorted list of {job_id: score}, higher score = better match
#         """
#         job_ids = list(job_data.keys())
#         job_descriptions = list(job_data.values())

#         # Convert user skills to a text format for matching
#         user_text = " ".join(user_skills) + f" {user_experience} years experience"

#         # 1️⃣ TF-IDF Matching
#         job_vectors = self.tfidf.fit_transform(job_descriptions)
#         user_vector = self.tfidf.transform([user_text])
#         tfidf_scores = cosine_similarity(user_vector, job_vectors)[0]

#         # 2️⃣ BERT Matching
#         job_embeddings = self.bert_model.encode(job_descriptions)
#         user_embedding = self.bert_model.encode([user_text])[0]
#         bert_scores = cosine_similarity([user_embedding], job_embeddings)[0]

#         # 3️⃣ Weighted Score Combination
#         final_scores = {job_id: 0.6 * tfidf + 0.4 * bert for job_id, tfidf, bert in zip(job_ids, tfidf_scores, bert_scores)}

#         # 4️⃣ Sort jobs based on score (Descending)
#         sorted_jobs = sorted(final_scores.items(), key=lambda x: x[1], reverse=True)
        
#         return sorted_jobs  # Returns sorted list of (job_id, score)
