from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
from bs4 import BeautifulSoup
import time
import re
from typing import List, Dict, Any
import logging
import os
from backend.scraper import scrape_indeed, scrape_naukri, scrape_unstop, scrape_linkedin

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate limiting
last_request_time = 0
MIN_REQUEST_INTERVAL = 2  # seconds

ADZUNA_APP_ID = "478e2d58"
ADZUNA_API_KEY = "003d6ccef719aec08d8442a7555c1060"

def validate_search_query(query: str) -> str:
    """Validate and sanitize the search query."""
    # Remove any potentially harmful characters
    sanitized = re.sub(r'[^a-zA-Z0-9\s-]', '', query)
    if not sanitized.strip():
        raise HTTPException(status_code=400, detail="Invalid search query")
    return sanitized

@app.get("/api/jobs")
async def get_jobs(search: str = Query("data scientist")) -> List[Dict[str, Any]]:
    global last_request_time
    
    try:
        # Rate limiting
        current_time = time.time()
        if current_time - last_request_time < MIN_REQUEST_INTERVAL:
            time.sleep(MIN_REQUEST_INTERVAL - (current_time - last_request_time))
        last_request_time = time.time()

        # Validate search query
        search = validate_search_query(search)
        
        url = f"https://api.adzuna.com/v1/api/jobs/in/search/1"
        params = {
            "app_id": ADZUNA_APP_ID,
            "app_key": ADZUNA_API_KEY,
            "results_per_page": 10,
            "what": search,
            "content-type": "application/json"
        }
        
        response = requests.get(url, params=params)
        if response.status_code != 200:
            logger.error(f"Failed to fetch jobs from Adzuna")
            raise HTTPException(status_code=503, detail="Failed to fetch jobs from Adzuna")
        data = response.json()
        jobs = []

        for result in data.get("results", []):
            try:
                title = result.get("title")
                company = result.get("company", {}).get("display_name", "")
                location = result.get("location", {}).get("display_name", "")
                skills = []  # Adzuna may not provide skills directly
                link = result.get("id")
                url = result.get("redirect_url", "")

                jobs.append({
                    "id": link,
                    "title": title,
                    "company": company,
                    "location": location,
                    "skills": skills,
                    "source": "adzuna",
                    "description": result.get("description", ""),
                    "url": url,
                    "saved": False
                })
            except Exception as e:
                logger.error(f"Error processing job card: {str(e)}")
                continue

        if not jobs:
            logger.warning(f"No jobs found for search query: {search}")
            return []

        print(response.status_code, response.text)
        return jobs

    except requests.RequestException as e:
        logger.error(f"Request error: {str(e)}")
        raise HTTPException(status_code=503, detail="Failed to fetch jobs from external service")
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}

@app.get("/api/scrape_jobs")
def get_jobs(
    query: str = Query(..., description="Job search query"),
    location: str = Query("India", description="Job location (country)"),
    experience: str = Query(None, description="Experience filter (e.g. '2-5 years')"),
    source: str = Query("all", description="Job source (indeed/naukri/unstop/linkedin/all)"),
    num_pages: int = Query(3, description="Number of pages to scrape per source")
):
    jobs = []
    if source in ("indeed", "all"):
        jobs.extend(scrape_indeed(query, location, num_pages=num_pages))
    if source in ("naukri", "all"):
        jobs.extend(scrape_naukri(query, location, experience, num_pages=num_pages))
    if source in ("unstop", "all"):
        jobs.extend(scrape_unstop(query, location, experience, num_pages=num_pages))
    if source in ("linkedin", "all"):
        jobs.extend(scrape_linkedin(query, location, experience, num_pages=num_pages))
    # Filter by experience if provided (for sources that don't support it natively)
    if experience:
        jobs = [job for job in jobs if 'experience' not in job or experience.lower() in job.get('experience', '').lower()]
    # Filter by country/location if provided
    if location:
        jobs = [job for job in jobs if location.lower() in job.get('location', '').lower()]
    return jobs
