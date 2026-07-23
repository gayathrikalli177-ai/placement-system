require("dotenv").config();

const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const pool = require("../db");

const companies = [
  {
    name: "Google LLC",
    email: "careers@google.example",
    location: "Bengaluru / Hyderabad (Hybrid)",
    package: 32.5,
    job: "Senior Software Engineer - Cloud & Infrastructure",
    description: "Design and implement high-scale distributed backend systems, Google Cloud Platform (GCP) microservices, and high-performance databases.",
    cgpa: 8.0,
    salary: 32.5,
    rounds: 4
  },
  {
    name: "Microsoft India",
    email: "careers@microsoft.example",
    location: "Hyderabad / Bengaluru",
    package: 28.0,
    job: "Full Stack Software Development Engineer (SDE)",
    description: "Build next-generation Azure cloud services, React web applications, and enterprise productivity features across Microsoft 365.",
    cgpa: 7.5,
    salary: 28.0,
    rounds: 4
  },
  {
    name: "Amazon Development Center",
    email: "careers@amazon.example",
    location: "Bengaluru / Chennai",
    package: 26.5,
    job: "Software Development Engineer (SDE II) - AWS",
    description: "Architect ultra-low latency distributed payment systems, Amazon Web Services (AWS) infrastructure, and e-commerce logistics microservices.",
    cgpa: 7.5,
    salary: 26.5,
    rounds: 4
  },
  {
    name: "Apple Technology",
    email: "careers@apple.example",
    location: "Hyderabad / Remote",
    package: 30.0,
    job: "iOS & Core Systems Software Engineer",
    description: "Develop core iOS frameworks, macOS performance libraries, and Swift client applications powering Apple devices worldwide.",
    cgpa: 8.0,
    salary: 30.0,
    rounds: 3
  },
  {
    name: "Meta Platforms",
    email: "careers@meta.example",
    location: "Gurugram / Remote",
    package: 35.0,
    job: "Frontend & Performance React Engineer",
    description: "Engineer high-speed web interfaces, GraphQL data pipelines, and React core component architectures for WhatsApp & Instagram web applications.",
    cgpa: 8.0,
    salary: 35.0,
    rounds: 4
  },
  {
    name: "NVIDIA Graphics",
    email: "careers@nvidia.example",
    location: "Pune / Bengaluru",
    package: 40.0,
    job: "AI & Accelerated GPU Systems Engineer",
    description: "Optimize CUDA parallel computing platforms, deep learning inference engines, and autonomous AI system software.",
    cgpa: 8.5,
    salary: 40.0,
    rounds: 4
  },
  {
    name: "Netflix Engineering",
    email: "careers@netflix.example",
    location: "Mumbai / Remote",
    package: 38.0,
    job: "Backend Microservices Architect",
    description: "Build fault-tolerant video streaming microservices, adaptive streaming algorithms, and edge caching network tools.",
    cgpa: 8.0,
    salary: 38.0,
    rounds: 3
  },
  {
    name: "Goldman Sachs",
    email: "careers@goldman.example",
    location: "Bengaluru / Hyderabad",
    package: 24.0,
    job: "Quantitative Financial Systems Software Analyst",
    description: "Develop algorithmic trading engines, risk management models, and high-frequency financial data processing applications.",
    cgpa: 7.5,
    salary: 24.0,
    rounds: 3
  },
  {
    name: "Adobe Systems",
    email: "careers@adobe.example",
    location: "Noida / Bengaluru",
    package: 22.5,
    job: "Creative Cloud Full Stack Developer",
    description: "Develop WebGL graphics tools, Node.js cloud document workflows, and interactive web canvas applications.",
    cgpa: 7.0,
    salary: 22.5,
    rounds: 3
  },
  {
    name: "Salesforce Cloud",
    email: "careers@salesforce.example",
    location: "Hyderabad / Gurugram",
    package: 25.0,
    job: "Enterprise SaaS Cloud Software Engineer",
    description: "Design multi-tenant SaaS CRM platforms, event-driven microservices, and enterprise API integration hubs.",
    cgpa: 7.2,
    salary: 25.0,
    rounds: 3
  }
];

async function run() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const passwordHash = await bcrypt.hash("password123", 12);
    for (const company of companies) {
      const { rows: companyRows } = await client.query(
        `INSERT INTO companies (company_name, email, password_hash, location, package_lpa)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (email) DO UPDATE SET company_name = EXCLUDED.company_name, location = EXCLUDED.location, package_lpa = EXCLUDED.package_lpa
         RETURNING company_id`,
        [company.name, company.email, passwordHash, company.location, company.package]
      );
      const companyId = companyRows[0].company_id;
      const { rows: existingJobs } = await client.query(
        "SELECT job_id FROM jobs WHERE company_id = $1 AND job_title = $2",
        [companyId, company.job]
      );
      if (existingJobs.length === 0) {
        const { rows: jobRows } = await client.query(
          `INSERT INTO jobs (company_id, job_title, description, min_cgpa, salary_lpa, location, deadline, round_count)
           VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE + 45, $7) RETURNING job_id`,
          [companyId, company.job, company.description, company.cgpa, company.salary, company.location, company.rounds]
        );
        for (let round = 1; round <= company.rounds; round += 1) {
          await client.query(
            "INSERT INTO job_rounds (job_id, round_number, round_name) VALUES ($1, $2, $3)",
            [jobRows[0].job_id, round, `Round ${round}`]
          );
        }
      }
    }
    await client.query("COMMIT");
    console.log("🎉 10 World-Class MNC Companies & Job Drives seeded successfully.");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Demo seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

run();
