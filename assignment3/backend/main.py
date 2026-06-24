from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.orm import declarative_base, sessionmaker, Session

# DB 설정 (sqlite)
DATABASE_URL = "sqlite:///./todos.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# DB 모델 정의
class TodoDB(Base):
    __tablename__ = "todos"
    
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    isCompleted = Column(Boolean, default=False)  # 프론트엔드(isCompleted)와의 필드 매핑 통일을 위해 camelCase 사용
    date = Column(String, nullable=False)  # YYYY-MM-DD 형식의 문자열

# 테이블 생성
Base.metadata.create_all(bind=engine)

# Pydantic 스키마 정의
class TodoCreate(BaseModel):
    text: str
    date: str

class TodoUpdate(BaseModel):
    text: Optional[str] = None
    isCompleted: Optional[bool] = None

class TodoResponse(BaseModel):
    id: int
    text: str
    isCompleted: bool
    date: str

    class Config:
        from_attributes = True

# FastAPI 앱 생성
app = FastAPI(title="Minimal Todo App Backend", version="1.0.0")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 로컬 개발 및 연동 테스트 편의를 위해 전체 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB 세션 Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "Hello World"}

# 1. Todo 목록 조회 (특정 날짜, 상태 필터링 및 검색 지원)
@app.get("/todos", response_model=List[TodoResponse])
def read_todos(date: Optional[str] = None, filter: Optional[str] = None, search: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(TodoDB)
    if date:
        query = query.filter(TodoDB.date == date)
    if filter == "active":
        query = query.filter(TodoDB.isCompleted == False)
    elif filter == "completed":
        query = query.filter(TodoDB.isCompleted == True)
    if search:
        query = query.filter(TodoDB.text.contains(search))
    return query.all()

# 1-2. Todo 단건 조회
@app.get("/todos/{id}", response_model=TodoResponse)
def read_todo(id: int, db: Session = Depends(get_db)):
    db_todo = db.query(TodoDB).filter(TodoDB.id == id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo item not found")
    return db_todo

# 2. 새 Todo 생성
@app.post("/todos", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    db_todo = TodoDB(text=todo.text, date=todo.date, isCompleted=False)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

# 3. Todo 수정 (PUT /todos/{id})
@app.put("/todos/{id}", response_model=TodoResponse)
def update_todo(id: int, todo_update: TodoUpdate, db: Session = Depends(get_db)):
    db_todo = db.query(TodoDB).filter(TodoDB.id == id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo item not found")
    
    if todo_update.text is not None:
        db_todo.text = todo_update.text
    if todo_update.isCompleted is not None:
        db_todo.isCompleted = todo_update.isCompleted
        
    db.commit()
    db.refresh(db_todo)
    return db_todo

# 4. Todo 삭제 (DELETE /todos/{id})
@app.delete("/todos/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(id: int, db: Session = Depends(get_db)):
    db_todo = db.query(TodoDB).filter(TodoDB.id == id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo item not found")
    
    db.delete(db_todo)
    db.commit()
    return None
