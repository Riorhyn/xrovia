import { z } from "zod";

export const RegisterSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  country: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const PersonalInfoSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  headline: z.string().max(120, "Headline too long").optional(),
  location: z.string().max(100).optional(),
  about: z.string().max(3000).optional(),
  photoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export const EducationSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  field: z.string().min(1, "Field of study is required"),
  institution: z.string().min(1, "Institution is required"),
  startYear: z.coerce.number().int().min(1950).max(2100),
  endYear: z.coerce.number().int().min(1950).max(2100).optional().nullable(),
  grade: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

export const ExperienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  employmentType: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  startDate: z.string().min(1, "Start date required"),
  endDate: z.string().optional().nullable(),
  isCurrent: z.boolean().default(false),
  description: z.string().optional().nullable(),
});

export const SkillSchema = z.object({
  name: z.string().min(1, "Skill name required").max(50),
});

export const ProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(10, "Provide a concise description"),
  role: z.string().optional().nullable(),
  tools: z.string().optional().nullable(),
  projectUrl: z.string().url("Must be valid URL").optional().or(z.literal("")),
});

export const ReportSchema = z.object({
  profileId: z.string().min(1),
  reason: z.enum([
    "FAKE_INFORMATION",
    "FAKE_IDENTITY",
    "FAKE_EMPLOYMENT",
    "FAKE_EDUCATION",
    "FRAUD_SCAM",
    "INAPPROPRIATE_CONTENT",
    "OTHER",
  ]),
  details: z.string().max(1000).optional(),
});