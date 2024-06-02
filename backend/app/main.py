from typing import List

import os
import random
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from starlette.responses import RedirectResponse

import sentry_sdk

load_dotenv()

from . import models, schemas
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

sentry_dsn = os.environ.get("SENTRY_DSN")
if sentry_dsn:
    sentry_sdk.init(
        dsn=sentry_dsn,
        traces_sample_rate=1.0,
        profiles_sample_rate=1.0,
    )
    
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

@app.get("/api/servers", response_model=List[schemas.Server])
def list_servers(db: Session = Depends(get_db)):
    servers = db.query(models.Server).all()
    return servers

@app.post("/api/servers", status_code=status.HTTP_201_CREATED, response_model=schemas.Server)
def create_server(server: schemas.ServerCreate, db: Session = Depends(get_db)):
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

@app.get("/api/servers/{id}", response_model=schemas.Server)
def read_server(id: int, db: Session = Depends(get_db)):
    server = db.query(models.Server).get(id)
    if not server:
        raise HTTPException(status_code=404, detail=f"server with id {id} not found")
    return server

@app.put("/api/servers/{id}", response_model=schemas.Server)
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

@app.delete("/api/servers/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_server(id: int, db: Session = Depends(get_db)):
    server = db.query(models.Server).get(id)
    if server:
        db.delete(server)
        db.commit()
    else:
        raise HTTPException(status_code=404, detail=f"Server with id {id} not found")

    return f"None"

@app.get('/api/healthcheck', status_code=status.HTTP_200_OK)
def perform_healthcheck():
    return {'healthcheck': 'Everything OK!'}

@app.get('/api/version', status_code=status.HTTP_200_OK)
def get_version():
    return {'version': os.getenv("BACKEND_VERSION")}

@app.get("/api/flaky", description="Flaky endpoint will generate an error sometimes. Configure via FLAKY_ERROR_PROBABILITY variable.")
def flaky_endpoint():
    # Set the probability of raising an error
    error_probability = float(os.environ.get("FLAKY_ERROR_PROBABILITY", 0.1))

    # Introduce randomness
    if random.random() < error_probability:
        # Raise a custom exception that should crash the application
        raise HTTPException(status_code=500, detail="Internal Server Error")

    return {"message": "OK"}