"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsAlreadyRegistered(false);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          country,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
        if (data.isAlreadyRegistered) {
          setIsAlreadyRegistered(true);
        }
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "16px",
    color: "#0f172a",
    backgroundColor: "#ffffff",
    boxSizing: "border-box" as const,
  };

  return (
    <main
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        padding: "48px 20px",
      }}
    >
      <h1 style={{ fontSize: "32px", marginBottom: "10px", fontWeight: "bold" }}>
        Create Professional ID
      </h1>

      <p style={{ color: "#64748b", marginBottom: "28px" }}>
        Create your XROVIA professional identity.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "18px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "600" }}>
            Full name
          </label>
          <input
            style={inputStyle}
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: "18px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "600" }}>
            Email address
          </label>
          <input
            style={inputStyle}
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: "18px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "600" }}>
            Password
          </label>
          <input
            style={inputStyle}
            type="password"
            placeholder="Minimum 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </div>

        {/* Added required attribute so native browser popup shows up */}
        <div style={{ marginBottom: "18px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "600" }}>
            Country
          </label>
          <input
            style={inputStyle}
            type="text"
            placeholder="Enter your country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>

        {/* Error Alert Box */}
        {error && (
          <div
            style={{
              padding: "14px",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              color: "#991b1b",
              marginBottom: "20px",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {error}
          </div>
        )}

        {/* Action Buttons */}
        {isAlreadyRegistered ? (
          <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
            <Link
              href="/login"
              style={{
                flex: 1,
                padding: "13px",
                borderRadius: "8px",
                backgroundColor: "#2563eb",
                color: "white",
                fontSize: "15px",
                fontWeight: "bold",
                textAlign: "center",
                textDecoration: "none",
              }}
            >
              Log In
            </Link>
            <button
              type="button"
              onClick={() => {
                setError("");
                setIsAlreadyRegistered(false);
              }}
              style={{
                flex: 1,
                padding: "13px",
                borderRadius: "8px",
                backgroundColor: "#ffffff",
                border: "1px solid #cbd5e1",
                color: "#334155",
                fontSize: "15px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Try Another Email
            </button>
          </div>
        ) : (
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#2563eb",
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        )}
      </form>
    </main>
  );
}