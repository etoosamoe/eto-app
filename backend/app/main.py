from typing import List

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from starlette.responses import RedirectResponse

from . import models, schemas
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

@app.get("/")
async def root():
   return {"message": "Hello World"}


@app.get("/docs")
def main():
    return RedirectResponse(url="/docs/")

@app.get("/servers", response_model=List[schemas.Server])
def list_servers(db: Session = Depends(get_db)):
    servers = db.query(models.Server).all()
    return servers

@app.post("/servers", status_code=status.HTTP_201_CREATED, response_model=schemas.Server)
def create_server(server: schemas.Server, db: Session = Depends(get_db)):
    new_server = models.Server(
        hostname = server.hostname,
        type = server.type,
        cores = server.cores,
        ram = server.ram,
        disk = server.disk)
    old_server = db.query(models.Server).filter_by(hostname = new_server.hostname).first()
    if old_server:
        raise HTTPException(status_code=303, detail=f"Server with hostname {old_server.hostname} is already created (id={old_server.id})")
    db.add(new_server)
    db.commit()
    id = new_server.id
    db.refresh(new_server)
    return new_server

@app.get("/servers/{id}", response_model=schemas.Server)
def read_server(id: int, db: Session = Depends(get_db)):
    server = db.query(models.Server).get(id)
    if not server:
        raise HTTPException(status_code=404, detail=f"server with id {id} not found")
    return server

@app.put("/servers/{id}", response_model=schemas.Server)
def update_server(id: int, upd_server: schemas.Server, db: Session = Depends(get_db)):
    server = db.query(models.Server).get(id)
    if server:
        server.hostname = upd_server.hostname
        server.type = upd_server.type
        server.cores = upd_server.cores
        server.ram = upd_server.ram
        server.disk = upd_server.disk
        db.commit()
        db.refresh(server)
    if not server:
        raise HTTPException(status_code=404, detail=f"server with id {id} not found")
    return upd_server

@app.delete("/servers/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_server(id: int, db: Session = Depends(get_db)):
    server = db.query(models.Server).get(id)
    if server:
        db.delete(server)
        db.commit()
    else:
        raise HTTPException(status_code=404, detail=f"server with id {id} not found")

    return f"None"
