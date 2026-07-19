--
-- PostgreSQL database dump
--

\restrict aaKHcuFCtplIPQf5OcZpzFlZbdjBcXCkzbttUbMFSFbdV2wuTTAisQT7xo2WtwH

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-07-17 22:08:14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 226 (class 1259 OID 16507)
-- Name: applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.applications (
    application_id integer NOT NULL,
    student_id integer NOT NULL,
    job_id integer NOT NULL,
    application_date date DEFAULT CURRENT_DATE,
    status character varying(30) DEFAULT 'Applied'::character varying
);


ALTER TABLE public.applications OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16506)
-- Name: applications_application_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.applications_application_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.applications_application_id_seq OWNER TO postgres;

--
-- TOC entry 5098 (class 0 OID 0)
-- Dependencies: 225
-- Name: applications_application_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.applications_application_id_seq OWNED BY public.applications.application_id;


--
-- TOC entry 222 (class 1259 OID 16473)
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.companies (
    company_id integer NOT NULL,
    company_name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    location character varying(100),
    package_lpa numeric(4,2),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.companies OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16472)
-- Name: companies_company_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.companies_company_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.companies_company_id_seq OWNER TO postgres;

--
-- TOC entry 5099 (class 0 OID 0)
-- Dependencies: 221
-- Name: companies_company_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.companies_company_id_seq OWNED BY public.companies.company_id;


--
-- TOC entry 233 (class 1259 OID 16572)
-- Name: interviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.interviews (
    interview_id integer NOT NULL,
    application_id integer NOT NULL,
    interview_date date,
    interview_time time without time zone,
    interview_mode character varying(50),
    interview_status character varying(30)
);


ALTER TABLE public.interviews OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16571)
-- Name: interviews_interview_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.interviews_interview_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.interviews_interview_id_seq OWNER TO postgres;

--
-- TOC entry 5100 (class 0 OID 0)
-- Dependencies: 232
-- Name: interviews_interview_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.interviews_interview_id_seq OWNED BY public.interviews.interview_id;


--
-- TOC entry 224 (class 1259 OID 16489)
-- Name: jobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jobs (
    job_id integer NOT NULL,
    company_id integer NOT NULL,
    job_title character varying(100) NOT NULL,
    description text,
    min_cgpa numeric(3,2),
    salary_lpa numeric(5,2),
    location character varying(100),
    deadline date
);


ALTER TABLE public.jobs OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16488)
-- Name: jobs_job_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.jobs_job_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jobs_job_id_seq OWNER TO postgres;

--
-- TOC entry 5101 (class 0 OID 0)
-- Dependencies: 223
-- Name: jobs_job_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jobs_job_id_seq OWNED BY public.jobs.job_id;


--
-- TOC entry 231 (class 1259 OID 16557)
-- Name: resumes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resumes (
    resume_id integer NOT NULL,
    student_id integer NOT NULL,
    resume_file character varying(255),
    resume_score numeric(5,2),
    uploaded_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.resumes OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16556)
-- Name: resumes_resume_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.resumes_resume_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.resumes_resume_id_seq OWNER TO postgres;

--
-- TOC entry 5102 (class 0 OID 0)
-- Dependencies: 230
-- Name: resumes_resume_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.resumes_resume_id_seq OWNED BY public.resumes.resume_id;


--
-- TOC entry 228 (class 1259 OID 16529)
-- Name: skills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.skills (
    skill_id integer NOT NULL,
    skill_name character varying(100) NOT NULL
);


ALTER TABLE public.skills OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16528)
-- Name: skills_skill_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.skills_skill_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.skills_skill_id_seq OWNER TO postgres;

--
-- TOC entry 5103 (class 0 OID 0)
-- Dependencies: 227
-- Name: skills_skill_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.skills_skill_id_seq OWNED BY public.skills.skill_id;


--
-- TOC entry 229 (class 1259 OID 16539)
-- Name: student_skills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_skills (
    student_id integer NOT NULL,
    skill_id integer NOT NULL
);


ALTER TABLE public.student_skills OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16457)
-- Name: students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students (
    student_id integer NOT NULL,
    full_name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    phone character varying(15),
    department character varying(50),
    year_of_study integer,
    cgpa numeric(3,2),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.students OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16456)
-- Name: students_student_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.students_student_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.students_student_id_seq OWNER TO postgres;

--
-- TOC entry 5104 (class 0 OID 0)
-- Dependencies: 219
-- Name: students_student_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.students_student_id_seq OWNED BY public.students.student_id;


--
-- TOC entry 4895 (class 2604 OID 16510)
-- Name: applications application_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications ALTER COLUMN application_id SET DEFAULT nextval('public.applications_application_id_seq'::regclass);


--
-- TOC entry 4892 (class 2604 OID 16476)
-- Name: companies company_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies ALTER COLUMN company_id SET DEFAULT nextval('public.companies_company_id_seq'::regclass);


--
-- TOC entry 4901 (class 2604 OID 16575)
-- Name: interviews interview_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interviews ALTER COLUMN interview_id SET DEFAULT nextval('public.interviews_interview_id_seq'::regclass);


--
-- TOC entry 4894 (class 2604 OID 16492)
-- Name: jobs job_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs ALTER COLUMN job_id SET DEFAULT nextval('public.jobs_job_id_seq'::regclass);


--
-- TOC entry 4899 (class 2604 OID 16560)
-- Name: resumes resume_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resumes ALTER COLUMN resume_id SET DEFAULT nextval('public.resumes_resume_id_seq'::regclass);


--
-- TOC entry 4898 (class 2604 OID 16532)
-- Name: skills skill_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skills ALTER COLUMN skill_id SET DEFAULT nextval('public.skills_skill_id_seq'::regclass);


--
-- TOC entry 4890 (class 2604 OID 16460)
-- Name: students student_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students ALTER COLUMN student_id SET DEFAULT nextval('public.students_student_id_seq'::regclass);


--
-- TOC entry 5085 (class 0 OID 16507)
-- Dependencies: 226
-- Data for Name: applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.applications (application_id, student_id, job_id, application_date, status) FROM stdin;
1	1	1	2026-07-13	Applied
2	1	2	2026-07-13	Applied
3	1	3	2026-07-16	Applied
4	1	3	2026-07-16	Applied
5	1	1	2026-07-16	Applied
6	1	1	2026-07-16	Applied
\.


--
-- TOC entry 5081 (class 0 OID 16473)
-- Dependencies: 222
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.companies (company_id, company_name, email, password, location, package_lpa, created_at) FROM stdin;
1	TCS	hr@tcs.com	tcs123	Hyderabad	7.50	2026-07-13 22:18:01.10797
2	Infosys	hr@infosys.com	info123	Bangalore	8.20	2026-07-13 22:18:01.10797
3	Google	hrgoogle@example.com	google123	Hyderabad	25.50	2026-07-16 15:05:43.428446
6	tcs	1234@gmail.com	12345	banglore	10.00	2026-07-16 22:45:13.165648
\.


--
-- TOC entry 5092 (class 0 OID 16572)
-- Dependencies: 233
-- Data for Name: interviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.interviews (interview_id, application_id, interview_date, interview_time, interview_mode, interview_status) FROM stdin;
1	1	2026-08-20	10:00:00	Online	Scheduled
\.


--
-- TOC entry 5083 (class 0 OID 16489)
-- Dependencies: 224
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.jobs (job_id, company_id, job_title, description, min_cgpa, salary_lpa, location, deadline) FROM stdin;
1	1	Java Developer	Develop Java applications	7.50	8.50	Hyderabad	2026-08-15
2	2	Data Analyst	Analyze business data	7.00	7.80	Bangalore	2026-08-20
3	1	Java Developer	Develop Java backend applications	7.50	8.50	\N	\N
4	1	Java Developer	Develop Java backend applications	7.50	8.50	\N	\N
6	2	Cisco	Data Analyst	7.00	8.00	\N	\N
\.


--
-- TOC entry 5090 (class 0 OID 16557)
-- Dependencies: 231
-- Data for Name: resumes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.resumes (resume_id, student_id, resume_file, resume_score, uploaded_at) FROM stdin;
1	1	gayathri_resume.pdf	82.50	2026-07-13 22:26:23.201379
\.


--
-- TOC entry 5087 (class 0 OID 16529)
-- Dependencies: 228
-- Data for Name: skills; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.skills (skill_id, skill_name) FROM stdin;
1	Java
2	Python
3	SQL
4	React
5	Node.js
6	PostgreSQL
7	Machine Learning
\.


--
-- TOC entry 5088 (class 0 OID 16539)
-- Dependencies: 229
-- Data for Name: student_skills; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.student_skills (student_id, skill_id) FROM stdin;
1	1
1	3
1	6
\.


--
-- TOC entry 5079 (class 0 OID 16457)
-- Dependencies: 220
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.students (student_id, full_name, email, password, phone, department, year_of_study, cgpa, created_at) FROM stdin;
1	Gayathri	gayathri@example.com	password123	9876543210	CSE	4	8.75	2026-07-13 22:17:00.604006
2	Rahul Sharma	rahul@example.com	rahul123	9876543211	CSE	4	8.90	2026-07-15 21:40:18.957632
6	Rahul Sharma	rahul12@example.com	rahul123	9876543211	CSE	4	8.90	2026-07-15 21:46:07.922646
9	Test User	test999@example.com	123456	9876543210	CSE	4	8.50	2026-07-16 21:45:32.286818
10	Gaaa	123@gmail.com	1234	9876543210	cse	4	7.00	2026-07-16 22:11:27.04426
\.


--
-- TOC entry 5105 (class 0 OID 0)
-- Dependencies: 225
-- Name: applications_application_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.applications_application_id_seq', 6, true);


--
-- TOC entry 5106 (class 0 OID 0)
-- Dependencies: 221
-- Name: companies_company_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.companies_company_id_seq', 6, true);


--
-- TOC entry 5107 (class 0 OID 0)
-- Dependencies: 232
-- Name: interviews_interview_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.interviews_interview_id_seq', 1, true);


--
-- TOC entry 5108 (class 0 OID 0)
-- Dependencies: 223
-- Name: jobs_job_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jobs_job_id_seq', 6, true);


--
-- TOC entry 5109 (class 0 OID 0)
-- Dependencies: 230
-- Name: resumes_resume_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.resumes_resume_id_seq', 1, true);


--
-- TOC entry 5110 (class 0 OID 0)
-- Dependencies: 227
-- Name: skills_skill_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.skills_skill_id_seq', 7, true);


--
-- TOC entry 5111 (class 0 OID 0)
-- Dependencies: 219
-- Name: students_student_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.students_student_id_seq', 10, true);


--
-- TOC entry 4913 (class 2606 OID 16517)
-- Name: applications applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (application_id);


--
-- TOC entry 4907 (class 2606 OID 16487)
-- Name: companies companies_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_email_key UNIQUE (email);


--
-- TOC entry 4909 (class 2606 OID 16485)
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (company_id);


--
-- TOC entry 4923 (class 2606 OID 16579)
-- Name: interviews interviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interviews
    ADD CONSTRAINT interviews_pkey PRIMARY KEY (interview_id);


--
-- TOC entry 4911 (class 2606 OID 16499)
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (job_id);


--
-- TOC entry 4921 (class 2606 OID 16565)
-- Name: resumes resumes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resumes
    ADD CONSTRAINT resumes_pkey PRIMARY KEY (resume_id);


--
-- TOC entry 4915 (class 2606 OID 16536)
-- Name: skills skills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_pkey PRIMARY KEY (skill_id);


--
-- TOC entry 4917 (class 2606 OID 16538)
-- Name: skills skills_skill_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_skill_name_key UNIQUE (skill_name);


--
-- TOC entry 4919 (class 2606 OID 16545)
-- Name: student_skills student_skills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_skills
    ADD CONSTRAINT student_skills_pkey PRIMARY KEY (student_id, skill_id);


--
-- TOC entry 4903 (class 2606 OID 16471)
-- Name: students students_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_email_key UNIQUE (email);


--
-- TOC entry 4905 (class 2606 OID 16469)
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (student_id);


--
-- TOC entry 4930 (class 2606 OID 16580)
-- Name: interviews fk_application; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interviews
    ADD CONSTRAINT fk_application FOREIGN KEY (application_id) REFERENCES public.applications(application_id);


--
-- TOC entry 4924 (class 2606 OID 16500)
-- Name: jobs fk_company; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT fk_company FOREIGN KEY (company_id) REFERENCES public.companies(company_id);


--
-- TOC entry 4925 (class 2606 OID 16523)
-- Name: applications fk_job; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT fk_job FOREIGN KEY (job_id) REFERENCES public.jobs(job_id);


--
-- TOC entry 4929 (class 2606 OID 16566)
-- Name: resumes fk_resume_student; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resumes
    ADD CONSTRAINT fk_resume_student FOREIGN KEY (student_id) REFERENCES public.students(student_id);


--
-- TOC entry 4926 (class 2606 OID 16518)
-- Name: applications fk_student; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES public.students(student_id);


--
-- TOC entry 4927 (class 2606 OID 16551)
-- Name: student_skills student_skills_skill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_skills
    ADD CONSTRAINT student_skills_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(skill_id);


--
-- TOC entry 4928 (class 2606 OID 16546)
-- Name: student_skills student_skills_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_skills
    ADD CONSTRAINT student_skills_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(student_id);


-- Completed on 2026-07-17 22:08:14

--
-- PostgreSQL database dump complete
--

\unrestrict aaKHcuFCtplIPQf5OcZpzFlZbdjBcXCkzbttUbMFSFbdV2wuTTAisQT7xo2WtwH

