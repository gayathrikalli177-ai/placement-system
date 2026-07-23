# 🎓 Campus Placement & Career Transformation Management System

A high-performance, enterprise-grade **Campus Placement & Recruitment Portal** engineered to connect graduating students with top Fortune 500 MNC technology leaders. Built with a modern glassmorphic dark theme, AI-powered ATS resume scoring, multi-round selection tracking, strict eligibility validation, and a Super Admin moderation command center.

---

## 🌟 Key System Features

### 🏢 1. World-Class MNC Recruitment Drives
Pre-seeded with live campus hiring drives from 10 world-class MNC companies:
- **NVIDIA Graphics** — AI & Accelerated GPU Systems Engineer (`💰 40.00 LPA`)
- **Netflix Engineering** — Backend Microservices Architect (`💰 38.00 LPA`)
- **Meta Platforms** — Frontend & Performance React Engineer (`💰 35.00 LPA`)
- **Google LLC** — Senior Software Engineer (Cloud & Infrastructure) (`💰 32.50 LPA`)
- **Apple Technology** — iOS & Core Systems Software Engineer (`💰 30.00 LPA`)
- **Microsoft India** — Full Stack SDE (`💰 28.00 LPA`)
- **Amazon Development Center** — SDE II (AWS Infrastructure) (`💰 26.50 LPA`)
- **Salesforce Cloud** — Enterprise SaaS Cloud Software Engineer (`💰 25.00 LPA`)
- **Goldman Sachs** — Quantitative Financial Systems Analyst (`💰 24.00 LPA`)
- **Adobe Systems** — Creative Cloud Full Stack Developer (`💰 22.50 LPA`)

---

### 📄 2. AI ATS Resume Scorer & Upload Dropzone
- **PDF Resume Upload**: Interactive drag-and-drop PDF resume upload zone.
- **Strict Multi-Factor Engine**: Evaluates target role keywords (`React`, `Node`, `SQL`, `PostgreSQL`, `REST APIs`, `DSA`), PDF formatting penalties, file structure, and candidate CGPA academic cutoffs.
- **Actionable ATS Report**: Generates an instant breakdown score out of 100 with tailored improvement recommendations.

---

### 🎓 3. Strict CGPA Cutoffs & Duplicate Application Prevention
- **Cutoff Eligibility Guard**: Automatically checks candidate CGPA against company cutoffs. Ineligible candidates see a `🚫 Below Cutoff` badge preventing unauthorized submissions.
- **Single Submission Constraint**: Candidates who have already applied to a drive see a green `✓ Already Applied` badge directing them to their application tracking studio.
- **Backend SQL Protection**: Database enforces `UNIQUE(student_id, job_id)` constraints.

---

### 📋 4. Student Application Tracking Studio (`/my-applications`)
- **Candidate Analytics Bar**: Tracks Total Applications, Shortlisted Drives, Selected Offers, and Pending Reviews.
- **Round Progress Timeline**: Interactive recruitment round roadmap displaying test scores, technical round statuses, and 1-Click `🎥 Join Interview Meeting` links.

---

### 👑 5. Super Admin Command Center (`/admin/dashboard`)
Full administrative rights to oversee and moderate the entire placement system:
- **Credentials**: `Gayathrikalli123@gmail.com` / `Gayathri@123`
- **Job Drive Moderation**: Inspect company job descriptions (`👁️ Inspect Scope`), emergency block drives (`🚫 Block Drive`), or delete inappropriate postings (`🗑️ Delete Job`).
- **Directory Control**: Manage or purge registered candidate accounts and corporate recruiters.
- **Status Override**: Override ATS application statuses (`Applied`, `Shortlisted`, `Selected`, `Rejected`).

---

### 🤖 6. Global AI Placement & Career Mentor Assistant
- **Floating Widget**: Accessible in the bottom-right corner across every page of the application.
- **Interactive Career Guidance**: Answers queries on study roadmaps (Web Dev, Java Backend, Data Science), MNC drive details, and ATS optimization tips with 1-Click suggestion chips.

---

### 📱 7. 100% Mobile & Laptop Responsive UI
- Crafted using modern Vanilla CSS with dark mode glassmorphism, responsive grid breakpoints, and touch-optimized action buttons for mobile, tablet, and desktop screens.

---

## 🔑 Demo Test Login Credentials

| Role | Email Address | Password | Direct Dashboard |
| :--- | :--- | :--- | :--- |
| **Student** | `student@demo.com` | `password123` | `/student/dashboard` |
| **Corporate Recruiter** | `company@demo.com` | `password123` | `/company/dashboard` |
| **Super Admin** | `Gayathrikalli123@gmail.com` | `Gayathri@123` | `/admin/dashboard` |

---

## 🛠️ Technology Stack

- **Frontend**: React 18, React Router v6, Vanilla CSS (Glassmorphism Design Tokens), Context API.
- **Backend**: Node.js, Express.js, PostgreSQL (`pg` pool driver), JWT Authentication, Bcryptjs password hashing, Zod validation.

---

## 🚀 Local Installation & Setup Guide

### 1. Prerequisites
- **Node.js** (v16.0 or higher)
- **PostgreSQL** database instance running locally

### 2. Repository Clone
```bash
git clone https://github.com/gayathrikalli177-ai/placement-system.git
cd placement-system
```

### 3. Backend Setup
```bash
cd backend
npm install

# Configure Environment Variables (.env)
# DB_HOST=localhost, DB_PORT=5432, DB_NAME=placement_system, DB_USER=postgres, DB_PASSWORD=yourpassword, JWT_SECRET=your_secret_key

# Run Database Migrations & Seeders
node scripts/migrate-placement-workflow.js
node scripts/seed-demo-jobs.js
node scripts/setup-admin.js

# Start Backend Server (runs on http://localhost:5000)
node server.js
```

### 4. Frontend Setup
```bash
cd ../frontend
npm install

# Start React Development Server (runs on http://localhost:3000)
npm start
```

---

## 📄 License
This project is open-source and available under the **MIT License**.
