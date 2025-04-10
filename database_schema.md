# Database Schema for Home Care SaaS Platform

## Entity Relationship Diagram (ERD)

```
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│     Users     │       │    Clients    │       │     Staff     │
├───────────────┤       ├───────────────┤       ├───────────────┤
│ id            │       │ id            │       │ id            │
│ email         │       │ user_id       │◄──────┤ user_id       │
│ password_hash │       │ first_name    │       │ first_name    │
│ role          │       │ last_name     │       │ last_name     │
│ created_at    │       │ address       │       │ address       │
│ updated_at    │       │ city          │       │ city          │
└───────┬───────┘       │ state         │       │ state         │
        │               │ zip_code      │       │ zip_code      │
        │               │ phone         │       │ phone         │
        │               │ emergency_contact│    │ hire_date     │
        │               │ notes         │       │ status        │
        │               │ status        │       │ hourly_rate   │
        │               │ created_at    │       │ created_at    │
        │               │ updated_at    │       │ updated_at    │
        │               └───────┬───────┘       └───────┬───────┘
        │                       │                       │
        │                       │                       │
        │               ┌───────▼───────┐       ┌───────▼───────┐
        │               │ClientPreferences│     │  StaffSkills  │
        │               ├───────────────┤       ├───────────────┤
        │               │ id            │       │ id            │
        │               │ client_id     │       │ staff_id      │
        │               │ preferred_time_start│ │ skill_id      │
        │               │ preferred_time_end│  │ level         │
        │               │ preferred_days  │     │ created_at    │
        │               │ preferred_staff_id│   │ updated_at    │
        │               │ special_instructions│ └───────────────┘
        │               │ created_at    │               ▲
        │               │ updated_at    │               │
        │               └───────────────┘               │
        │                                               │
        │                                       ┌───────┴───────┐
        │                                       │    Skills     │
        │                                       ├───────────────┤
        │                                       │ id            │
        │                                       │ name          │
        │                                       │ description   │
        │                                       │ created_at    │
        │                                       │ updated_at    │
        │                                       └───────────────┘
        │
        │               ┌───────────────┐       ┌───────────────┐
        └──────────────►│   Schedules   │       │  Appointments │
                        ├───────────────┤       ├───────────────┤
                        │ id            │       │ id            │
                        │ name          │◄──────┤ schedule_id   │
                        │ start_date    │       │ client_id     │
                        │ end_date      │       │ staff_id      │
                        │ status        │       │ start_time    │
                        │ created_by    │       │ end_time      │
                        │ created_at    │       │ status        │
                        │ updated_at    │       │ notes         │
                        └───────────────┘       │ created_at    │
                                                │ updated_at    │
                                                └───────┬───────┘
                                                        │
                        ┌───────────────┐       ┌───────▼───────┐
                        │     Keys      │       │ AppointmentServices│
                        ├───────────────┤       ├───────────────┤
                        │ id            │       │ id            │
                        │ client_id     │◄──────┤ appointment_id│
                        │ key_type      │       │ service_id    │
                        │ key_identifier│       │ duration      │
                        │ status        │       │ notes         │
                        │ notes         │       │ created_at    │
                        │ created_at    │       │ updated_at    │
                        │ updated_at    │       └───────────────┘
                        └───────┬───────┘               ▲
                                │                       │
                                ▼                       │
                        ┌───────────────┐       ┌───────┴───────┐
                        │  KeyHandovers │       │   Services    │
                        ├───────────────┤       ├───────────────┤
                        │ id            │       │ id            │
                        │ key_id        │       │ name          │
                        │ from_staff_id │       │ description   │
                        │ to_staff_id   │       │ duration      │
                        │ handover_time │       │ rate          │
                        │ status        │       │ created_at    │
                        │ notes         │       │ updated_at    │
                        │ created_at    │       └───────────────┘
                        │ updated_at    │
                        └───────────────┘

                        ┌───────────────┐
                        │   Locations   │
                        ├───────────────┤
                        │ id            │
                        │ address       │
                        │ city          │
                        │ state         │
                        │ zip_code      │
                        │ latitude      │
                        │ longitude     │
                        │ created_at    │
                        │ updated_at    │
                        └───────────────┘

                        ┌───────────────┐
                        │ TravelTimes   │
                        ├───────────────┤
                        │ id            │
                        │ from_location_id│
                        │ to_location_id│
                        │ travel_time   │
                        │ distance      │
                        │ traffic_factor│
                        │ last_updated  │
                        │ created_at    │
                        │ updated_at    │
                        └───────────────┘
```

## Data Models

### Users
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

### Clients
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

### Staff
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

### Skills
```sql
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### StaffSkills
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

### ClientPreferences
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

### Locations
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

### TravelTimes
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

### Schedules
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

### Services
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

### Appointments
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

### AppointmentServices
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

### Keys
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

### KeyHandovers
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

## Indexes

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
CREATE INDEX idx_staff_status ON staff(status);
CREATE INDEX idx_staff_zip_code ON staff(zip_code);

-- Staff skills indexes
CREATE INDEX idx_staff_skills_staff_id ON staff_skills(staff_id);
CREATE INDEX idx_staff_skills_skill_id ON staff_skills(skill_id);

-- Client preferences indexes
CREATE INDEX idx_client_preferences_client_id ON client_preferences(client_id);
CREATE INDEX idx_client_preferences_preferred_staff_id ON client_preferences(preferred_staff_id);

-- Locations indexes
CREATE INDEX idx_locations_zip_code ON locations(zip_code);
CREATE INDEX idx_locations_coordinates ON locations(latitude, longitude);

-- Travel times indexes
CREATE INDEX idx_travel_times_from_location_id ON travel_times(from_location_id);
CREATE INDEX idx_travel_times_to_location_id ON travel_times(to_location_id);

-- Schedules indexes
CREATE INDEX idx_schedules_date_range ON schedules(start_date, end_date);
CREATE INDEX idx_schedules_status ON schedules(status);
CREATE INDEX idx_schedules_created_by ON schedules(created_by);

-- Appointments indexes
CREATE INDEX idx_appointments_schedule_id ON appointments(schedule_id);
CREATE INDEX idx_appointments_client_id ON appointments(client_id);
CREATE INDEX idx_appointments_staff_id ON appointments(staff_id);
CREATE INDEX idx_appointments_time_range ON appointments(start_time, end_time);
CREATE INDEX idx_appointments_status ON appointments(status);

-- Appointment services indexes
CREATE INDEX idx_appointment_services_appointment_id ON appointment_services(appointment_id);
CREATE INDEX idx_appointment_services_service_id ON appointment_services(service_id);

-- Keys indexes
CREATE INDEX idx_keys_client_id ON keys(client_id);
CREATE INDEX idx_keys_status ON keys(status);

-- Key handovers indexes
CREATE INDEX idx_key_handovers_key_id ON k
(Content truncated due to size limit. Use line ranges to read in chunks)