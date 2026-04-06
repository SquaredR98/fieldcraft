"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { use } from "react";

interface ResponseData {
  id: string;
  schemaId: string;
  schemaVersion: string;
  data: Record<string, unknown>;
  metadata: Record<string, unknown> | null;
  completedAt: string | null;
  createdAt: string;
}

export default function ResponseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchResponse();
  }, [id]);

  async function fetchResponse() {
    try {
      const res = await fetch(`http://localhost:4000/api/v1/responses/${id}`, {
        headers: {
          "X-API-Key": "test-api-key-123",
        },
      });

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Response not found");
        }
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      setResponse(data.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to load response");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading response...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">
          ❌ Error: {error}
          <br />
          <Link href="/responses" className="button" style={{ marginTop: "0.5rem" }}>
            ← Back to Responses
          </Link>
        </div>
      </div>
    );
  }

  if (!response) {
    return null;
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>Response Details</h1>
          <Link href="/responses" className="button button-secondary">
            ← Back to List
          </Link>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: "1rem" }}>Metadata</h2>
        <table>
          <tbody>
            <tr>
              <th>Response ID</th>
              <td>
                <code>{response.id}</code>
              </td>
            </tr>
            <tr>
              <th>Schema ID</th>
              <td>
                <code>{response.schemaId}</code>
              </td>
            </tr>
            <tr>
              <th>Schema Version</th>
              <td>{response.schemaVersion}</td>
            </tr>
            <tr>
              <th>Submitted At</th>
              <td>{new Date(response.createdAt).toLocaleString()}</td>
            </tr>
            {response.completedAt && (
              <tr>
                <th>Completed At</th>
                <td>{new Date(response.completedAt).toLocaleString()}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: "1rem" }}>Form Values (Decrypted)</h2>
        <table>
          <thead>
            <tr>
              <th>Field</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(response.data).map(([key, value]) => (
              <tr key={key}>
                <th>{key}</th>
                <td>
                  {typeof value === "boolean"
                    ? value
                      ? "✓ Yes"
                      : "✗ No"
                    : typeof value === "object"
                      ? JSON.stringify(value)
                      : String(value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {response.metadata && Object.keys(response.metadata).length > 0 && (
        <div className="card">
          <h2 style={{ marginBottom: "1rem" }}>Additional Metadata</h2>
          <pre
            style={{
              background: "#f5f5f5",
              padding: "1rem",
              borderRadius: "4px",
              overflow: "auto",
            }}
          >
            {JSON.stringify(response.metadata, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
