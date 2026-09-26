import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://xrovia.com";
  const now = new Date();

  const pages = [
    ["", "weekly", 1],
    ["/about", "monthly", 0.9],
    ["/professional-identity", "monthly", 0.9],
    ["/digital-professional-profile", "monthly", 0.9],
    ["/career-profile", "monthly", 0.9],
    ["/how-it-works", "monthly", 0.8],
    ["/career/job-search", "monthly", 0.8],
    ["/career/fresher-jobs", "monthly", 0.8],
    ["/career/internships", "monthly", 0.8],
    ["/career/engineering-jobs", "monthly", 0.8],
    ["/career/mechanical-engineering-jobs", "monthly", 0.8],
    ["/professional-profile", "monthly", 0.8],
    ["/professional-profile-for-students", "monthly", 0.8],
    ["/career-portfolio", "monthly", 0.8],
    ["/online-cv", "monthly", 0.8],
    ["/project-portfolio-for-students", "monthly", 0.8],
    ["/feedback", "monthly", 0.3],
  ] as const;

  return pages.map(([path, changeFrequency, priority]) => ({
    url: baseUrl + path,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
