const { z } = require("zod");

class ValidationError extends Error {
    constructor(issues) {
        super("Request validation failed");
        this.name = "ValidationError";
        this.statusCode = 400;
        this.issues = issues;
    }
}

function validate(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            return next(new ValidationError(result.error.issues));
        }

        req.validatedBody = result.data;
        return next();
    };
}

function validateParams(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.params);
        if (!result.success) return next(new ValidationError(result.error.issues));
        req.validatedParams = result.data;
        return next();
    };
}

const email = z.string().trim().toLowerCase().email().max(100);
const password = z.string().min(12, "Password must be at least 12 characters").max(64);
const phone = z.string().trim().regex(/^\+?[0-9]{7,15}$/, "Enter a valid phone number");
const date = z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD for the deadline")
    .refine((value) => {
        const parsed = new Date(`${value}T00:00:00.000Z`);
        return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
    }, "Enter a valid deadline")
    .refine((value) => value >= new Date().toISOString().slice(0, 10), "Deadline cannot be in the past");

const studentRegistrationSchema = z.object({
    full_name: z.string().trim().min(2).max(100),
    email,
    password,
    phone,
    department: z.string().trim().min(2).max(50),
    year_of_study: z.coerce.number().int().min(1).max(8),
    cgpa: z.coerce.number().min(0).max(10)
}).strict();

const companyRegistrationSchema = z.object({
    company_name: z.string().trim().min(2).max(100),
    email,
    password,
    location: z.string().trim().min(2).max(100),
    package_lpa: z.coerce.number().positive().max(99.99)
}).strict();

const loginSchema = z.object({ email, password: z.string().min(1).max(64) }).strict();

const jobSchema = z.object({
    job_title: z.string().trim().min(2).max(100),
    description: z.string().trim().min(10).max(5000),
    min_cgpa: z.coerce.number().min(0).max(10),
    salary_lpa: z.coerce.number().positive().max(999.99),
    location: z.string().trim().min(2).max(100),
    deadline: date,
    round_count: z.coerce.number().int().min(1).max(10)
}).strict();
const jobUpdateSchema = z.object({
    job_title: z.string().trim().min(2).max(100),
    description: z.string().trim().min(10).max(5000),
    min_cgpa: z.coerce.number().min(0).max(10),
    salary_lpa: z.coerce.number().positive().max(999.99),
    location: z.string().trim().min(2).max(100),
    deadline: date,
    is_open: z.boolean()
}).strict();

const jobApplicationSchema = z.object({
    job_id: z.coerce.number().int().positive()
}).strict();
const jobIdParamSchema = z.object({ jobId: z.coerce.number().int().positive() }).strict();
const applicationManagementParamSchema = z.object({
    jobId: z.coerce.number().int().positive(),
    applicationId: z.coerce.number().int().positive()
}).strict();
const roundManagementParamSchema = applicationManagementParamSchema.extend({
    applicationRoundId: z.coerce.number().int().positive()
}).strict();
const jobRoundParamSchema = jobIdParamSchema.extend({
    roundId: z.coerce.number().int().positive()
}).strict();
const jobRoundUpdateSchema = z.object({
    round_name: z.string().trim().min(2).max(100)
}).strict();
const applicationStatusSchema = z.object({ status: z.enum(["Shortlisted", "Rejected", "Selected"]) }).strict();
const roundStatusSchema = z.object({
    status: z.enum(["Pending", "Scheduled", "Passed", "Failed"]),
    remarks: z.string().trim().max(1000).optional(),
    scheduled_at: z.string().datetime().optional().or(z.literal("")),
    interview_mode: z.enum(["Online", "Offline"]).optional().or(z.literal("")),
    meeting_details: z.string().trim().max(500).optional()
}).strict();
const applicationFormSchema = z.object({
    phone: phone,
    department: z.string().trim().min(2).max(50),
    year_of_study: z.coerce.number().int().min(1).max(8),
    cgpa: z.coerce.number().min(0).max(10),
    skills: z.string().trim().min(2).max(1000),
    linkedin_url: z.string().trim().url().max(255).optional().or(z.literal("")),
    portfolio_url: z.string().trim().url().max(255).optional().or(z.literal("")),
    why_fit: z.string().trim().min(20).max(2000),
    availability_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    cover_letter: z.string().trim().max(2000).optional(),
    declaration: z.enum(["true"])
}).passthrough();

const studentProfileUpdateSchema = z.object({
    full_name: z.string().trim().min(2).max(100),
    phone: z.string().trim().regex(/^\+?[0-9]{7,15}$/, "Enter a valid phone number"),
    department: z.string().trim().min(2).max(50),
    year_of_study: z.coerce.number().int().min(1).max(8),
    cgpa: z.coerce.number().min(0).max(10)
}).strict();

const companyProfileUpdateSchema = z.object({
    company_name: z.string().trim().min(2).max(100),
    location: z.string().trim().min(2).max(100),
    package_lpa: z.coerce.number().positive().max(99.99)
}).strict();

module.exports = {
    validate,
    validateParams,
    ValidationError,
    studentRegistrationSchema,
    studentProfileUpdateSchema,
    companyRegistrationSchema,
    companyProfileUpdateSchema,
    loginSchema,
    jobSchema,
    jobUpdateSchema,
    jobApplicationSchema,
    jobIdParamSchema,
    applicationManagementParamSchema,
    roundManagementParamSchema,
    jobRoundParamSchema,
    jobRoundUpdateSchema,
    applicationStatusSchema,
    roundStatusSchema,
    applicationFormSchema
};
