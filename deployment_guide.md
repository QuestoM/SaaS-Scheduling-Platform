# Deployment Guide for Home Care Scheduling SaaS Platform

## Table of Contents

1. [Introduction](#introduction)
2. [System Requirements](#system-requirements)
3. [Deployment Options](#deployment-options)
4. [Local Development Setup](#local-development-setup)
5. [Docker Deployment](#docker-deployment)
6. [Kubernetes Deployment](#kubernetes-deployment)
7. [Cloud Provider Deployment](#cloud-provider-deployment)
8. [Database Setup](#database-setup)
9. [Configuration](#configuration)
10. [Security Considerations](#security-considerations)
11. [Monitoring and Logging](#monitoring-and-logging)
12. [Backup and Recovery](#backup-and-recovery)
13. [Scaling](#scaling)
14. [Troubleshooting](#troubleshooting)

## Introduction

This guide provides detailed instructions for deploying the Home Care Scheduling SaaS Platform in various environments, from local development to production. The platform consists of several components that work together to provide a comprehensive scheduling solution for home care services.

### Platform Components

1. **Frontend Application**: React.js web application
2. **Backend API**: Node.js/Express.js REST API
3. **Scheduling Optimization Service**: Python-based optimization service
4. **Database**: PostgreSQL database
5. **Cache**: Redis cache
6. **Search Engine**: Elasticsearch (optional)
7. **Message Queue**: RabbitMQ for asynchronous processing (optional)

## System Requirements

### Minimum Requirements

#### Development Environment
- **CPU**: 4 cores
- **RAM**: 8GB
- **Storage**: 20GB
- **Operating System**: macOS, Windows 10/11, or Linux

#### Production Environment (Small Scale)
- **Web Server**: 2 vCPUs, 4GB RAM
- **API Server**: 2 vCPUs, 4GB RAM
- **Database**: 2 vCPUs, 8GB RAM
- **Optimization Service**: 2 vCPUs, 4GB RAM
- **Redis Cache**: 1 vCPU, 2GB RAM
- **Elasticsearch**: 2 vCPUs, 4GB RAM (optional)
- **Storage**: 100GB SSD

#### Production Environment (Medium Scale)
- **Web Server**: 4 vCPUs, 8GB RAM (2+ instances)
- **API Server**: 4 vCPUs, 8GB RAM (2+ instances)
- **Database**: 4 vCPUs, 16GB RAM
- **Optimization Service**: 4 vCPUs, 8GB RAM
- **Redis Cache**: 2 vCPUs, 4GB RAM
- **Elasticsearch**: 4 vCPUs, 8GB RAM (optional)
- **Storage**: 500GB SSD

#### Production Environment (Large Scale)
- **Web Server**: 8 vCPUs, 16GB RAM (3+ instances)
- **API Server**: 8 vCPUs, 16GB RAM (3+ instances)
- **Database**: 8 vCPUs, 32GB RAM (with read replicas)
- **Optimization Service**: 8 vCPUs, 16GB RAM (2+ instances)
- **Redis Cache**: 4 vCPUs, 8GB RAM (clustered)
- **Elasticsearch**: 8 vCPUs, 16GB RAM (clustered, optional)
- **Storage**: 1TB+ SSD

### Software Requirements

- **Docker**: 20.10.x or later
- **Docker Compose**: 2.x or later
- **Kubernetes**: 1.22.x or later (for Kubernetes deployment)
- **Node.js**: 16.x or later
- **Python**: 3.8 or later
- **PostgreSQL**: 13.x or later
- **Redis**: 6.x or later
- **Elasticsearch**: 7.10.x or later (optional)
- **RabbitMQ**: 3.9.x or later (optional)

## Deployment Options

The Home Care Scheduling Platform can be deployed in several ways:

1. **Local Development**: Using Docker Compose for local development and testing
2. **Docker Deployment**: Using Docker Compose for small-scale production deployments
3. **Kubernetes Deployment**: Using Kubernetes for scalable production deployments
4. **Cloud Provider Deployment**: Using managed services from cloud providers like AWS, Azure, or Google Cloud

## Local Development Setup

### Prerequisites

- Docker and Docker Compose installed
- Git installed
- Node.js and npm installed (for local development without Docker)
- Python and pip installed (for local development without Docker)

### Clone the Repository

```bash
git clone https://github.com/your-organization/homecare-platform.git
cd homecare-platform
```

### Using Docker Compose

1. Create a `.env` file in the root directory with the following variables:

```
# Database
DB_HOST=db
DB_PORT=5432
DB_NAME=homecare
DB_USER=postgres
DB_PASSWORD=postgres

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# Elasticsearch
ELASTICSEARCH_HOST=elasticsearch
ELASTICSEARCH_PORT=9200

# API
API_PORT=4000
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development

# Frontend
REACT_APP_API_BASE_URL=http://localhost:4000/api/v1
```

2. Start the development environment:

```bash
docker-compose -f docker-compose.dev.yml up
```

3. Access the application:
   - Frontend: http://localhost:3000
   - API: http://localhost:4000
   - API Documentation: http://localhost:4000/api-docs

### Manual Setup (Without Docker)

#### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with the following variables:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=homecare
DB_USER=postgres
DB_PASSWORD=postgres
REDIS_HOST=localhost
REDIS_PORT=6379
ELASTICSEARCH_HOST=localhost
ELASTICSEARCH_PORT=9200
API_PORT=4000
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

4. Start the backend server:

```bash
npm run dev
```

#### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with the following variables:

```
REACT_APP_API_BASE_URL=http://localhost:4000/api/v1
```

4. Start the frontend development server:

```bash
npm start
```

#### Optimization Service Setup

1. Navigate to the optimization directory:

```bash
cd optimization
```

2. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Create a `.env` file with the following variables:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=homecare
DB_USER=postgres
DB_PASSWORD=postgres
PORT=5000
```

5. Start the optimization service:

```bash
python app.py
```

## Docker Deployment

### Production Docker Compose Setup

1. Create a `docker-compose.prod.yml` file:

```yaml
version: '3.8'

services:
  web:
    image: homecare/web:latest
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    ports:
      - "80:80"
    depends_on:
      - api
    environment:
      - REACT_APP_API_BASE_URL=${API_BASE_URL}
    restart: always

  api:
    image: homecare/api:latest
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    ports:
      - "4000:4000"
    depends_on:
      - db
      - redis
      - elasticsearch
      - optimization
    environment:
      - NODE_ENV=production
      - PORT=${API_PORT}
      - DB_HOST=${DB_HOST}
      - DB_PORT=${DB_PORT}
      - DB_NAME=${DB_NAME}
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
      - REDIS_HOST=${REDIS_HOST}
      - REDIS_PORT=${REDIS_PORT}
      - ELASTICSEARCH_HOST=${ELASTICSEARCH_HOST}
      - ELASTICSEARCH_PORT=${ELASTICSEARCH_PORT}
      - JWT_SECRET=${JWT_SECRET}
    restart: always

  optimization:
    image: homecare/optimization:latest
    build:
      context: ./optimization
      dockerfile: Dockerfile.prod
    ports:
      - "5000:5000"
    environment:
      - PYTHONUNBUFFERED=1
      - DB_HOST=${DB_HOST}
      - DB_PORT=${DB_PORT}
      - DB_NAME=${DB_NAME}
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
    restart: always

  db:
    image: postgres:13
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=${DB_NAME}
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

  redis:
    image: redis:6
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: always

  elasticsearch:
    image: elasticsearch:7.10.0
    ports:
      - "9200:9200"
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    restart: always

  nginx:
    image: nginx:latest
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - web
      - api
    restart: always

volumes:
  postgres_data:
  redis_data:
  elasticsearch_data:
```

2. Create a `.env.prod` file with production values:

```
# Database
DB_HOST=db
DB_PORT=5432
DB_NAME=homecare
DB_USER=postgres
DB_PASSWORD=your_secure_password

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# Elasticsearch
ELASTICSEARCH_HOST=elasticsearch
ELASTICSEARCH_PORT=9200

# API
API_PORT=4000
API_BASE_URL=https://api.your-domain.com/api/v1
JWT_SECRET=your_secure_jwt_secret_key
NODE_ENV=production
```

3. Create Nginx configuration:

```
# nginx/nginx.conf
events {
    worker_connections 1024;
}

http {
    server {
        listen 80;
        server_name your-domain.com www.your-domain.com;
        
        location / {
            return 301 https://$host$request_uri;
        }
    }

    server {
        listen 443 ssl;
        server_name your-domain.com www.your-domain.com;

        ssl_certificate /etc/nginx/ssl/your-domain.crt;
        ssl_certificate_key /etc/nginx/ssl/your-domain.key;
        
        location / {
            proxy_pass http://web;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        location /api/ {
            proxy_pass http://api:4000/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

4. Build and start the production environment:

```bash
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

## Kubernetes Deployment

### Prerequisites

- Kubernetes cluster set up and configured
- kubectl installed and configured
- Helm installed (optional, for package management)

### Deployment Files

Create the following Kubernetes manifest files:

#### Namespace

```yaml
# kubernetes/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: homecare
```

#### ConfigMap

```yaml
# kubernetes/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: homecare-config
  namespace: homecare
data:
  db_host: "postgres"
  db_port: "5432"
  db_name: "homecare"
  redis_host: "redis"
  redis_port: "6379"
  elasticsearch_host: "elasticsearch"
  elasticsearch_port: "9200"
  api_port: "4000"
  node_env: "production"
  optimization_service_url: "http://optimization:5000"
```

#### Secrets

```yaml
# kubernetes/secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: homecare-secrets
  namespace: homecare
type: Opaque
data:
  db_user: cG9zdGdyZXM=  # base64 encoded "postgres"
  db_password: eW91cl9zZWN1cmVfcGFzc3dvcmQ=  # base64 encoded "your_secure_password"
  jwt_secret: eW91cl9zZWN1cmVfand0X3NlY3JldF9rZXk=  # base64 encoded "your_secure_jwt_secret_key"
```

#### Database

```yaml
# kubernetes/postgres.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: homecare
spec:
  serviceName: "postgres"
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:13
        ports:
        - containerPort: 5432
        env:
        - name: POSTGRES_DB
          valueFrom:
            configMapKeyRef:
              name: homecare-config
              key: db_name
        - name: POSTGRES_USER
          valueFrom:
            secretKeyRef:
              name: homecare-secrets
              key: db_user
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: homecare-secrets
              key: db_password
        volumeMounts:
        - name: postgres-data
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
  - metadata:
      name: postgres-data
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 10Gi
---
apiVersion: v1
kind: Service
metadata:
  name: postgres
  namespace: homecare
spec:
  selector:
    app: postgres
  ports:
  - port: 5432
    targetPort: 5432
  clusterIP: None
```

#### Redis

```yaml
# kubernetes/redis.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  namespace: homecare
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: redis:6
        ports:
        - containerPort: 6379
        volumeMounts:
        - name: redis-data
          mountPath: /data
      volumes:
      - name: redis-data
        persistentVolumeClaim:
          claimName: redis-pvc
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: redis-pvc
  namespace: homecare
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
---
apiVersion: v1
kind: Service
metadata:
  name: redis
  namespace: homecare
spec:
  selector:
    app: redis
  ports:
  - port: 6379
    targetPort: 6379
```

#### Elasticsearch (Optional)

```yaml
# kubernetes/elasticsearch.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: elasticsearch
  namespace: homecare
spec:
  serviceName: "elasticsearch"
  replicas: 1
  selector:
    matchLabels:
      app: elasticsearch
  template:
    metadata:
      labels:
        app: elasticsearch
    spec:
      containers:
      - name: elasticsearch
        image: elasticsearch:7.10.0
        ports:
        - containerPort: 9200
        - containerPort: 9300
        env:
        - name: discovery.type
          value: single-node
        - name: ES_JAVA_OPTS
          value: "-Xms512m -Xmx512m"
        volumeMounts:
        - name: elasticsearch-data
          mountPath: /usr/share/elasticsearch/data
  volumeClaimTemplates:
  - metadata:
      name: elasticsearch-data
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 10Gi
---
apiVersion: v1
kind: Service
metadata:
  name: elasticsearch
  namespace: homecare
spec:
  selector:
    app: elasticsearch
  ports:
  - port: 9200
    targetPort: 9200
    name: http
  - port: 9300
    targetPort: 9300
    name: transport
```

#### Optimization Service

```yaml
# kubernetes/optimization.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: optimization
  namespace: homecare
spec:
  replicas: 1
  selector:
    matchLabels:
      app: optimization
  template:
    metadata:
      labels:
        app: optimization
    spec:
      containers:
      - name: optimization
        image: homecare/optimization:latest
        ports:
        - containerPort: 5000
        env:
        - name: PYTHONUNBUFFERED
          value: "1"
        - name: DB_HOST
          valueFrom:
            configMapKeyRef:
              name: homecare-config
              key: db_host
        - name: DB_PORT
          valueFrom:
            configMapKeyRef:
              name: homecare-config
              key: db_port
        - name: DB_NAME
          valueFrom:
            configMapKeyRef:
              name: homecare-config
              key: db_name
        - name: DB_USER
          valueFrom:
            secretKeyRef:
              name: homecare-secrets
              key: db_user
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: homecare-secrets
              key: db_password
        resources:
          limits:
            cpu: "1"
            memory: "1Gi"
          requests:
            cpu: "500m"
            memory: "512Mi"
        livenessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
  
(Content truncated due to size limit. Use line ranges to read in chunks)