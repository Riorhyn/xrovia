import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://xrovia.com";
  const now = new Date();

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: baseUrl + "/professional-identity",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: baseUrl + "/digital-professional-profile",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: baseUrl + "/career-profile",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: baseUrl + "/how-it-works",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: baseUrl + "/feedback",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];
}
