# backend/routers/stats.py

from fastapi import APIRouter
import pandas as pd
import re
from db import engine
from region_mapping import region_mapping

router = APIRouter()

# 기술분야 분류 기준
category_keywords = {
    "Frontend": {"React", "Vue", "HTML", "CSS", "JavaScript", "TypeScript", "SCSS"},
    "Backend": {"Spring", "Node.js", "Django", "Flask", "REST API"},
    "Database": {"MySQL", "PostgreSQL", "MongoDB", "Oracle", "Redis"},
    "DevOps/Infra": {"AWS", "Docker", "Kubernetes", "Jenkins", "Nginx", "Apache", "Linux"},
    "Mobile": {"Kotlin", "Swift", "Flutter", "React Native", "Android", "iOS"},
    "Data/AI": {"TensorFlow", "PyTorch", "Pandas", "Scikit-learn", "Spark"},
    "Languages": {"Python", "Java", "C", "C++", "C#", "Go", "Rust"},
    "Tools/Etc": {"Git", "GitHub", "Jira", "Slack", "VSCode", "IntelliJ"}
}

# 기술스택 전처리 함수
def extract_keywords(text):
    if pd.isna(text):
        return []
    cleaned = re.sub(r'[·•:]', ',', text)
    cleaned = re.sub(r',+', ',', cleaned)
    cleaned = re.sub(r'\s*,\s*', ',', cleaned)
    return [kw.strip() for kw in cleaned.strip(', ').split(',') if kw.strip()]

@router.get("/stats/tech-ratio")
def get_tech_ratio(region: str = None):
    df = pd.read_sql("SELECT location, tech_stack FROM jumpit_jobs", engine)

    if region:
        short_region = region_mapping.get(region, region)
        df = df[df['location'].str.contains(short_region, na=False)]

    df['keywords'] = df['tech_stack'].apply(extract_keywords)

    category_counter = {key: {} for key in category_keywords}
    for keywords in df['keywords']:
        for kw in keywords:
            for category, kw_set in category_keywords.items():
                if kw in kw_set:
                    category_counter[category][kw] = category_counter[category].get(kw, 0) + 1

    def normalize(counter):
        total = sum(counter.values())
        return {k: round(v / total * 100, 2) for k, v in counter.items()}

    return {
        cat: normalize(counter)
        for cat, counter in category_counter.items()
        if counter
    }

# ✅ 추가된 지역별 job_type 비율 API
@router.get("/stats/jobtype-ratio-by-region")
def get_jobtype_ratio_by_region():
    df = pd.read_sql("SELECT location, job_type FROM jumpit_jobs", engine)

    # 정규표현식을 활용한 지역 추출
    def extract_region(loc):
        match = re.search(r"(서울|경기|인천|대전|대구|부산|광주|울산|세종|강원|충북|충남|전북|전남|경북|경남|제주)", loc)
        return match.group(0) if match else "기타"

    df["region"] = df["location"].apply(extract_region)

    region_count = df.groupby("region").size().rename("count")
    pivot = df.pivot_table(index="region", columns="job_type", aggfunc="size", fill_value=0)
    ratio = pivot.div(pivot.sum(axis=1), axis=0).multiply(100).round(1)

    result = []
    for region in region_count.index:
        result.append({
            "region": region,
            "count": int(region_count[region]),
            "jobTypeRatio": {
                job_type: float(ratio.loc[region, job_type])
                for job_type in pivot.columns if ratio.loc[region, job_type] > 0
            }
        })

    return result
