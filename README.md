# eto-app

Example application with backend as API, frontend and database to train some programming and DevOps skills.

## Backend

Base API CRUD Python application, working with fastapi, sqlalchemy, pydantic.

By default works with SQLite file-based database stored in the container — it will be cleaned after restart.

You can find swagger at `/docs`.

### Load example data
To load some predifined data use:
```
python3 load.py
```

## How to run

Fill in the .env file:

```
mv .env.example .env
nano .env
```

### Local
```
cd backend
python3 -m pip install -r requirements.py
uvicorn app.main:app
```

### Docker
Works as non-root user `worker`
```
cd backend
docker build -t eto-backend:latest .
docker run --env-file .env -p 8000:8000 eto-backend:latest
```

### Docker Compose

WIP

### Example of usage

```
curl --request POST \
  --url http://127.0.0.1:8000/servers \
  --header 'Content-Type: application/json' \
  --header 'accept: application/json' \
  --data '{
  "hostname": "ci00.ah",
  "type": "hw",
  "cores": 32,
  "ram": 64,
  "disk": 1100
}'
```