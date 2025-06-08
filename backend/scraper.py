import requests
from bs4 import BeautifulSoup
import logging

def scrape_indeed(query, location, num_pages=3):
    jobs = []
    for page in range(num_pages):
        url = (
            f"https://www.indeed.com/jobs?q={requests.utils.quote(query)}"
            f"&l={requests.utils.quote(location)}&start={page*10}"
        )
        headers = {
            "User-Agent": "Mozilla/5.0"
        }
        resp = requests.get(url, headers=headers)
        soup = BeautifulSoup(resp.text, "html.parser")
        for card in soup.select("a.tapItem"):
            title = card.select_one("h2.jobTitle").get_text(strip=True)
            company = card.select_one("span.companyName")
            company = company.get_text(strip=True) if company else ""
            location = card.select_one("div.companyLocation")
            location = location.get_text(strip=True) if location else ""
            job_url = "https://www.indeed.com" + card.get("href")
            jobs.append({
                "title": title,
                "company": company,
                "location": location,
                "url": job_url,
                "source": "Indeed"
            })
    return jobs

def scrape_naukri(query, location, experience=None, num_pages=3):
    jobs = []
    logger = logging.getLogger("naukri_scraper")
    for page in range(num_pages):
        url = (
            f"https://www.naukri.com/{query.replace(' ', '-')}-jobs-in-{location.replace(' ', '-')}-{page}"
        )
        headers = {"User-Agent": "Mozilla/5.0"}
        resp = requests.get(url, headers=headers)
        soup = BeautifulSoup(resp.text, "html.parser")
        found = 0
        for card in soup.select("article.jobTuple"):
            title = card.select_one("a.title")
            company = card.select_one("a.subTitle")
            loc = card.select_one("li.location span")
            exp = card.select_one("li.experience span")
            job_url = title['href'] if title else ''
            # Filter by experience if provided
            if experience and exp and experience not in exp.get_text():
                continue
            jobs.append({
                "title": title.get_text(strip=True) if title else '',
                "company": company.get_text(strip=True) if company else '',
                "location": loc.get_text(strip=True) if loc else '',
                "experience": exp.get_text(strip=True) if exp else '',
                "url": job_url,
                "source": "Naukri"
            })
            found += 1
        logger.info(f"Naukri: {found} jobs found on page {page+1} for url {url}")
    return jobs

def scrape_unstop(query, location, experience=None, num_pages=3):
    jobs = []
    logger = logging.getLogger("unstop_scraper")
    for page in range(1, num_pages+1):
        url = f"https://unstop.com/jobs?search={requests.utils.quote(query)}&page={page}"
        headers = {"User-Agent": "Mozilla/5.0"}
        resp = requests.get(url, headers=headers)
        soup = BeautifulSoup(resp.text, "html.parser")
        found = 0
        for card in soup.select("div.opportunity-card"):
            title = card.select_one(".opportunity-title")
            company = card.select_one(".opportunity-company-name")
            loc = card.select_one(".opportunity-location")
            job_url = card.select_one("a")
            job_url = 'https://unstop.com' + job_url['href'] if job_url and job_url.has_attr('href') else ''
            jobs.append({
                "title": title.get_text(strip=True) if title else '',
                "company": company.get_text(strip=True) if company else '',
                "location": loc.get_text(strip=True) if loc else '',
                "url": job_url,
                "source": "Unstop"
            })
            found += 1
        logger.info(f"Unstop: {found} jobs found on page {page} for url {url}")
    return jobs

def scrape_linkedin(query, location, experience=None, num_pages=3):
    # LinkedIn scraping is not supported due to login and anti-bot measures.
    # This is a placeholder that returns an empty list.
    return []
