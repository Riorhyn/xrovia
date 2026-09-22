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

  const [otp, setOtp] = useState("");
  const [verificationStep, setVerificationStep] = useState(false);

  const [error, setError] = useState("");
  const [isAlreadyRegistered, setIsAlreadyRegistered] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
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

      setVerificationStep(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code: otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Verification failed");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setResending(true);

    try {
      const response = await fetch(
        "/api/auth/resend-verification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not resend code");
        return;
      }

      setError("");
      setOtp("");
      alert("A new verification code has been sent.");
    } catch {
      setError("Could not resend verification code.");
    } finally {
      setResending(false);
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

  if (verificationStep) {
    return (
      <main
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          padding: "48px 20px",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            marginBottom: "10px",
            fontWeight: "bold",
          }}
        >
          Verify your email
        </h1>

        <p style={{ color: "#64748b", marginBottom: "28px" }}>
          We sent a 6-digit verification code to{" "}
          <strong>{email}</strong>.
        </p>

        <form onSubmit={handleVerify}>
          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Verification code
            </label>

            <input
              style={{
                ...inputStyle,
                textAlign: "center",
                letterSpacing: "8px",
                fontSize: "24px",
              }}
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, ""))
              }
              required
            />
          </div>

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
            {loading ? "Verifying..." : "Verify email"}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            style={{
              width: "100%",
              marginTop: "12px",
              padding: "13px",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              backgroundColor: "#ffffff",
              color: "#334155",
              fontSize: "15px",
              fontWeight: "bold",
              cursor: resending ? "not-allowed" : "pointer",
            }}
          >
            {resending ? "Sending..." : "Resend code"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        padding: "48px 20px",
      }}
    >
      <h1
        style={{
          fontSize: "32px",
          marginBottom: "10px",
          fontWeight: "bold",
        }}
      >
        Create Professional ID
      </h1>

      <p style={{ color: "#64748b", marginBottom: "28px" }}>
        Create your XROVIA professional identity.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "18px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
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
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
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
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
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

        <div style={{ marginBottom: "18px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
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

        {isAlreadyRegistered ? (
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "10px",
            }}
          >
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
