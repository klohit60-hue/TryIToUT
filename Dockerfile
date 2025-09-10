# Multi-stage build: build React frontend, then run FastAPI backend

# 1) Frontend build
FROM node:20-alpine AS frontend
WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci --no-audit --no-fund
COPY frontend/ ./
RUN npm run build

# 2) Backend runtime
FROM python:3.9-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# System deps needed by opencv and rembg
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 libglib2.0-0 curl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Install backend dependencies (CPU-friendly, Linux-compatible)
# Pin to versions that worked locally
RUN pip install --upgrade pip && pip install \
    fastapi==0.110.0 \
    uvicorn[standard]==0.27.1 \
    pillow==10.3.0 \
    rembg==2.0.57 \
    requests==2.32.3 \
    python-multipart==0.0.9 \
    python-dotenv==1.0.1 \
    numpy==1.26.4 \
    opencv-python-headless==4.9.0.80 \
    onnxruntime==1.17.3

# Copy backend code
COPY backend/ /app/

# Copy frontend build to static dir served by FastAPI
RUN mkdir -p /app/static
COPY --from=frontend /frontend/dist/ /app/static/

ENV PORT=8080 \
    REMBG_MODEL=u2netp \
    MAX_DIM=1024
EXPOSE 8080

# Heroku sets $PORT; default to 8080 for local Docker run
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}


