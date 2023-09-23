import csv
import datetime

from app import models
from app.database import SessionLocal, engine

db = SessionLocal()

models.Base.metadata.create_all(bind=engine)

with open("dataset.csv", "r") as f:
    csv_reader = csv.DictReader(f)

    for row in csv_reader:
        db_record = models.Server(
            hostname=row['hostname'],
            type=row['type'],
            cores=row['cores'],
            ram=row['ram'],
            disk=row['disk'],
        )
        db.add(db_record)

    db.commit()

db.close()