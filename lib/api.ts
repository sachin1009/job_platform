export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  skills: string[];
  source: string;
  description: string;
  url: string;
  saved: boolean;
}

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public statusText?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchJobs(search = "", source = "", where = "", experience = "", page = 1): Promise<Job[]> {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (source) params.append("source", source);
  if (where) params.append("where", where);
  if (experience) params.append("experience", experience);
  if (page) params.append("page", String(page));

  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/jobs?${params.toString()}`);
      
      if (!res.ok) {
        throw new APIError(
          `Failed to fetch jobs: ${res.statusText}`,
          res.status,
          res.statusText
        );
      }

      const data = await res.json();
      
      // Validate response data
      if (!Array.isArray(data)) {
        throw new APIError('Invalid response format: expected an array');
      }

      return data as Job[];
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt < MAX_RETRIES) {
        console.warn(`Attempt ${attempt} failed, retrying in ${RETRY_DELAY}ms...`);
        await delay(RETRY_DELAY * attempt); // Exponential backoff
      }
    }
  }

  console.error('All retry attempts failed:', lastError);
  throw lastError;
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) {
      throw new APIError('Health check failed', res.status, res.statusText);
    }
    const data = await res.json();
    return data.status === 'healthy';
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
}
