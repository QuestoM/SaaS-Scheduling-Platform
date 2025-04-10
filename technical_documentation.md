# Technical Documentation for Home Care SaaS Platform

## Overview

This document provides technical documentation for the Home Care Scheduling SaaS Platform, including system architecture, database schema, scheduling algorithm, and implementation details. This documentation is intended for developers, system administrators, and technical stakeholders.

## System Architecture

### Architecture Overview

The Home Care Scheduling Platform uses a microservices architecture with the following components:

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Client Applications                           │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────────────┐    │
│  │ Web Interface │  │ Mobile App    │  │ Third-party           │    │
│  │ (Responsive)  │  │ (Progressive) │  │ Integrations          │    │
│  └───────┬───────┘  └───────┬───────┘  └───────────┬───────────┘    │
└──────────┼───────────────────┼─────────────────────┼────────────────┘
           │                   │                     │
           ▼                   ▼                     ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           API Gateway                                │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ Authentication │ Rate Limiting │ Request Routing │ Monitoring  │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       Microservices Layer                            │
│                                                                     │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐            │
│  │ User Service  │  │ Client Service│  │ Staff Service │            │
│  └───────────────┘  └───────────────┘  └───────────────┘            │
│                                                                     │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐            │
│  │ Schedule      │  │ Optimization  │  │ Key Management│            │
│  │ Service       │  │ Service       │  │ Service       │            │
│  └───────────────┘  └───────────────┘  └───────────────┘            │
│                                                                     │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐            │
│  │ Notification  │  │ Reporting     │  │ Integration   │            │
│  │ Service       │  │ Service       │  │ Service       │            │
│  └───────────────┘  └───────────────┘  └───────────────┘            │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         Data Layer                                   │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐            │
│  │ Primary       │  │ Cache         │  │ Search        │            │
│  │ Database      │  │ Database      │  │ Engine        │            │
│  └───────────────┘  └───────────────┘  └───────────────┘            │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                     Data Warehouse                            │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### Technology Stack

#### Frontend
- **Web Application**: React.js with TypeScript
  - Material-UI for component library
  - Redux for state management
  - React Router for navigation
- **Mobile Application**: React Native
  - Shared codebase with web application where possible
  - Native modules for device-specific functionality

#### Backend
- **API Layer**: Node.js with Express.js
  - TypeScript for type safety
  - JWT for authentication
  - API documentation with Swagger/OpenAPI
- **Microservices**: Node.js microservices architecture
  - Service discovery and registry
  - Circuit breaker pattern for fault tolerance
- **Scheduling Algorithm**: Python with specialized libraries
  - NumPy, SciPy for mathematical operations
  - OR-Tools for constraint programming and optimization
  - Containerized as a microservice

#### Data Storage
- **Primary Database**: PostgreSQL
  - Geographic extensions for location-based queries
  - Robust transaction support
- **Cache Layer**: Redis
  - Session storage
  - Frequently accessed data caching
  - Real-time updates
- **Search Engine**: Elasticsearch
  - Full-text search capabilities
  - Complex querying for staff/client matching
- **Data Warehouse**: Amazon Redshift or Google BigQuery
  - Historical data storage
  - Analytics and reporting

#### DevOps & Infrastructure
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions or GitLab CI
- **Cloud Provider**: AWS, Azure, or Google Cloud Platform
- **Monitoring**: Prometheus and Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)

### Component Details

#### User Service
- User authentication and authorization
- Role-based access control
- User profile management
- Session management

#### Client Service
- Client information management
- Client preferences and requirements
- Service history
- Client location management

#### Staff Service
- Staff profile management
- Skills and qualifications tracking
- Availability management
- Performance metrics

#### Schedule Service
- Schedule creation and management
- Appointment booking
- Schedule viewing and filtering
- Schedule change management

#### Optimization Service
- Staff-client matching algorithms
- Route optimization
- Travel time calculation
- Schedule optimization

#### Key Management Service
- Physical key tracking
- Key handover management
- Digital lock integration
- Key possession history

#### Notification Service
- Email notifications
- SMS alerts
- Push notifications
- In-app messaging

#### Reporting Service
- Standard reports generation
- Custom report builder
- Data visualization
- Export functionality

#### Integration Service
- Third-party API integrations
- Calendar synchronization
- Mapping service integration
- Payment processing integration

### Communication Patterns

The microservices communicate using the following patterns:

1. **Synchronous Communication**: REST APIs for direct service-to-service communication
2. **Asynchronous Communication**: Message queues (RabbitMQ) for event-driven communication
3. **Service Discovery**: Kubernetes service discovery for locating services
4. **API Gateway**: Central entry point for all client requests

### Security Architecture

#### Authentication & Authorization
- JWT-based authentication
- OAuth 2.0 for third-party integrations
- Role-based access control
- Multi-factor authentication for sensitive operations

#### Data Security
- Encryption at rest and in transit
- PII (Personally Identifiable Information) protection
- Data anonymization for analytics
- Regular security audits

#### Compliance
- HIPAA compliance (if handling health information)
- GDPR compliance for personal data
- SOC 2 compliance for service organizations

## Database Schema

### Entity Relationship Diagram

The database schema consists of the following main entities and their relationships:

- **Users**: Authentication and authorization information
- **Clients**: Client personal and contact information
- **Staff**: Staff personal, contact, and employment information
- **Skills**: Available skills for staff members
- **StaffSkills**: Many-to-many relationship between staff and skills
- **ClientPreferences**: Client service preferences
- **Locations**: Physical locations with geocoding information
- **TravelTimes**: Cached travel times between locations
- **Schedules**: Schedule metadata
- **Services**: Available service types
- **Appointments**: Scheduled appointments
- **AppointmentServices**: Services included in appointments
- **Keys**: Physical or digital keys for client homes
- **KeyHandovers**: Key transfer records between staff members

### Table Definitions

#### Users
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'coordinator', 'staff', 'client')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Clients
```sql
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    emergency_contact VARCHAR(255),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Staff
```sql
CREATE TABLE staff (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    hire_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
    hourly_rate DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Skills
```sql
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### StaffSkills
```sql
CREATE TABLE staff_skills (
    id SERIAL PRIMARY KEY,
    staff_id INTEGER REFERENCES staff(id) ON DELETE CASCADE,
    skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
    level VARCHAR(50) CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(staff_id, skill_id)
);
```

#### ClientPreferences
```sql
CREATE TABLE client_preferences (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    preferred_time_start TIME,
    preferred_time_end TIME,
    preferred_days VARCHAR(255), -- Stored as comma-separated days (e.g., "mon,wed,fri")
    preferred_staff_id INTEGER REFERENCES staff(id) ON DELETE SET NULL,
    special_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Locations
```sql
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(address, city, state, zip_code)
);
```

#### TravelTimes
```sql
CREATE TABLE travel_times (
    id SERIAL PRIMARY KEY,
    from_location_id INTEGER REFERENCES locations(id) ON DELETE CASCADE,
    to_location_id INTEGER REFERENCES locations(id) ON DELETE CASCADE,
    travel_time INTEGER NOT NULL, -- in seconds
    distance DECIMAL(10, 2) NOT NULL, -- in miles or kilometers
    traffic_factor DECIMAL(5, 2) DEFAULT 1.0, -- multiplier for traffic conditions
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(from_location_id, to_location_id)
);
```

#### Schedules
```sql
CREATE TABLE schedules (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Services
```sql
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL, -- in minutes
    rate DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Appointments
```sql
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    schedule_id INTEGER REFERENCES schedules(id) ON DELETE CASCADE,
    client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    staff_id INTEGER REFERENCES staff(id) ON DELETE SET NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### AppointmentServices
```sql
CREATE TABLE appointment_services (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER REFERENCES appointments(id) ON DELETE CASCADE,
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
    duration INTEGER NOT NULL, -- in minutes, may differ from standard service duration
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Keys
```sql
CREATE TABLE keys (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    key_type VARCHAR(50) NOT NULL CHECK (key_type IN ('physical', 'digital', 'code')),
    key_identifier VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'lost')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### KeyHandovers
```sql
CREATE TABLE key_handovers (
    id SERIAL PRIMARY KEY,
    key_id INTEGER REFERENCES keys(id) ON DELETE CASCADE,
    from_staff_id INTEGER REFERENCES staff(id) ON DELETE SET NULL,
    to_staff_id INTEGER REFERENCES staff(id) ON DELETE SET NULL,
    handover_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Indexes

The database includes the following indexes to optimize query performance:

```sql
-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Clients table indexes
CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_zip_code ON clients(zip_code);

-- Staff table indexes
CREATE INDEX idx_staff_user_id ON staff(user_id);
CREA
(Content truncated due to size limit. Use line ranges to read in chunks)