"use client";

import { FormEngineRenderer } from "@squaredr/formengine-react";
import type { FormResponse } from "@squaredr/formengine-core";
import { contactFormSchema } from "../schemas/contact-form";
import { useCallback, useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [responseId, setResponseId] = useState("");

  const handleSubmit = useCallback(async (response: FormResponse) => {
    setSubmitStatus("submitting");

    try {
      const res = await fetch("http://localhost:4000/api/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": "test-api-key-123",
        },
        body: JSON.stringify({
          schemaId: response.schemaId,
          schemaVersion: response.schemaVersion,
          sessionToken: response.sessionToken,
          data: response.values,
          metadata: response.metadata,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      setResponseId(data.data.id);
      setSubmitStatus("success");
    } catch (error) {
      console.error("Submit error:", error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to submit");
      setSubmitStatus("error");
    }
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h1>FormEngine Demo</h1>
        <p>
          This is a simple demonstration of FormEngine with a contact form.
          Fill out the form below and submit to see it in action.
        </p>
        <p>
          <Link href="/responses" className="button button-secondary">
            View Responses
          </Link>
        </p>
      </div>

      {submitStatus === "success" && (
        <div className="success-message">
          Form submitted successfully!
          <br />
          Response ID: <strong>{responseId}</strong>
          <br />
          <Link href="/responses" className="button" style={{ marginTop: "0.5rem" }}>
            View All Responses
          </Link>
        </div>
      )}

      {submitStatus === "error" && (
        <div className="error-message">
          Error submitting form: {errorMessage}
          <br />
          <button
            className="button"
            style={{ marginTop: "0.5rem" }}
            onClick={() => setSubmitStatus("idle")}
          >
            Try Again
          </button>
        </div>
      )}

      <div className="card">
        <FormEngineRenderer
          schema={contactFormSchema}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
