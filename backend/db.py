from sqlalchemy import create_engine

# PostgreSQL 연결 설정 (비밀번호는 본인 환경에 맞게 수정)
DB_URL = "postgresql+psycopg2://postgres:123456@localhost:5432/jumpit_db"
engine = create_engine(DB_URL)
