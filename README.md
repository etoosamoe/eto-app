# eto-app

![Images Build](https://github.com/etoosamoe/eto-app/actions/workflows/build.yml/badge.svg)

Simple application to train some programming and DevOps skills. It contains:
- Backend API (Python, FastAPI, SQLAlchemy, Pydantic)
- Frontend (NodeJS, React)
- Database (default - local SQLite file)

## Backend

Base API CRUD Python application, working with fastapi, sqlalchemy, pydantic.

By default works with SQLite file-based database stored in the container — all data will be deleted after restart.

You can set your own database connection in `backend/.env` file or with a `DB_CONN` variable (See `docker-compose.yml`).

You can find swagger at `/docs`. API enpoint is `/servers`

## How to run backend

### Local

Fill in the .env file:

```
mv .env.example .env
nano .env
```

```
cd backend
python3 -m pip install -r requirements.py
uvicorn app.main:app
```
#### Load example data

To load some predifined data from `dataset.csv` use:
```
python3 load.py
```

### Docker

Works as non-root user `worker`. You can build your own image:

```
cd backend
docker build -t eto-backend:latest .
docker run --env-file .env -p 8000:8000 eto-backend:latest
```

Or run my image from DockerHub:

```
docker run --env-file .env -p 8000:8000 etoosamoe/eto-backend:latest
```

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

# Frontend

Frontend works with NodeJS and uses React. It makes requests to backend API to get some data about servers.
![How frontend looks like](docs/frontend01.png)

## How to run frontend

### Local

```
cd frontend
npm install
npm start
```
Then go to http://127.0.0.1:3000.

To build static files:

```
cd frontend
npm install
npm run build
```
Files will be in the `build` directory.

### Docker

This is a multi-stage build, and final image contains only Nginx web-server, static files from build image, and Nginx configuration file (`frontend/nginx.conf`). Nginx also proxy-passes all requests to `/servers`, `/version`, `/docs` locations to backend instance. (See `frontend/Dockerfile`)

```
cd frontend
docker build -t eto-frontend:latest .
docker run --env-file .env -p 3000:3000 eto-frontend:latest
```

Or run my image from DockerHub:

```
docker run --env-file .env -p 3000:3000 etoosamoe/eto-frontend:latest
```

# How to run entire app
## Docker Compose

```
docker compose pull
docker compose up -d --no-build
```

## Helm

WIP

# Monitoring

Backend has `/healthcheck` endpoint which returns status-code `200`.

Prometheus-like metrics endpoint:

WIP