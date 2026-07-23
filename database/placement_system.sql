-- Campus Placement System schema
-- This file intentionally contains no credentials, passwords, or personal data.

CREATE TABLE students (
    student_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    department VARCHAR(50),
    year_of_study INTEGER,
    cgpa NUMERIC(3, 2),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE companies (
    company_id SERIAL PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    location VARCHAR(100),
    package_lpa NUMERIC(4, 2),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE jobs (
    job_id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(company_id),
    job_title VARCHAR(100) NOT NULL,
    description TEXT,
    min_cgpa NUMERIC(3, 2),
    salary_lpa NUMERIC(5, 2),
    location VARCHAR(100),
    deadline DATE,
    round_count INTEGER NOT NULL DEFAULT 1 CHECK (round_count BETWEEN 1 AND 10),
    is_open BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE job_rounds (
    job_round_id SERIAL PRIMARY KEY,
    job_id INTEGER NOT NULL REFERENCES jobs(job_id) ON DELETE CASCADE,
    round_number INTEGER NOT NULL CHECK (round_number > 0),
    round_name VARCHAR(100) NOT NULL,
    round_type VARCHAR(50) NOT NULL DEFAULT 'Assessment',
    UNIQUE (job_id, round_number)
);

CREATE TABLE applications (
    application_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(student_id),
    job_id INTEGER NOT NULL REFERENCES jobs(job_id),
    application_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'Applied',
    cover_letter TEXT,
    application_phone VARCHAR(15),
    application_department VARCHAR(50),
    application_year INTEGER,
    application_cgpa NUMERIC(3, 2),
    skills TEXT,
    linkedin_url VARCHAR(255),
    portfolio_url VARCHAR(255),
    why_fit TEXT,
    availability_date DATE,
    declaration BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT applications_student_job_unique UNIQUE (student_id, job_id)
);

CREATE TABLE skills (
    skill_id SERIAL PRIMARY KEY,
    skill_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE student_skills (
    student_id INTEGER NOT NULL REFERENCES students(student_id),
    skill_id INTEGER NOT NULL REFERENCES skills(skill_id),
    PRIMARY KEY (student_id, skill_id)
);

CREATE TABLE resumes (
    resume_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(student_id),
    application_id INTEGER UNIQUE REFERENCES applications(application_id) ON DELETE CASCADE,
    resume_file VARCHAR(255),
    resume_score NUMERIC(5, 2),
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE application_rounds (
    application_round_id SERIAL PRIMARY KEY,
    application_id INTEGER NOT NULL REFERENCES applications(application_id) ON DELETE CASCADE,
    job_round_id INTEGER NOT NULL REFERENCES job_rounds(job_round_id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL DEFAULT 'Pending',
    scheduled_at TIMESTAMP,
    interview_mode VARCHAR(20),
    meeting_details VARCHAR(500),
    remarks TEXT,
    UNIQUE (application_id, job_round_id)
);

CREATE TABLE interviews (
    interview_id SERIAL PRIMARY KEY,
    application_id INTEGER NOT NULL REFERENCES applications(application_id),
    interview_date DATE,
    interview_time TIME,
    interview_mode VARCHAR(50),
    interview_status VARCHAR(30)
);
