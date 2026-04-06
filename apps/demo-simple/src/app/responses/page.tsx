"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Response {
  id: string;
  schemaId: string;
  schemaVersion: string;
  completedAt: string;
  createdAt: string;
}

export default function ResponsesPage() {
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchResponses();
  }, []);

  async function fetchResponses() {
    try {
      const res = await fetch("http://localhost:4000/api/v1/responses?schemaId=contact-form", {
        headers: {
          "X-API-Key": "test-api-key-123",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      setResponses(data.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to load responses");
    } finally {
      setLoading(false);
    }
  }

  async function deleteResponse(id: string) {
    if (!confirm("Are you sure you want to delete this response?")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/api/v1/responses/${id}`, {
        method: "DELETE",
        headers: {
          "X-API-Key": "test-api-key-123",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      // Refresh list
      await fetchResponses();
    } catch (err) {
      console.error("Delete error:", err);
      alert(`Failed to delete: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  }

  async function exportCSV() {
    try {
      const res = await fetch(
        "http://localhost:4000/api/v1/responses/export?schemaId=contact-form",
        {
          headers: {
            "X-API-Key": "test-api-key-123",
          },
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const csv = await res.text();
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `responses-${new Date().toISOString()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
      alert(`Failed to export: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1>Form Responses</h1>
            <p>Viewing responses for the contact form</p>
          </div>
          <div>
            <Link href="/" className="button button-secondary" style={{ marginRight: "0.5rem" }}>
              ← Back to Form
            </Link>
            {responses.length > 0 && (
              <button className="button" onClick={exportCSV}>
                Export CSV
              </button>
            )}
          </div>
        </div>
      </div>

      {loading && <div className="loading">Loading responses...</div>}

      {error && (
        <div className="error-message">
          ❌ Error: {error}
          <br />
          <button className="button" style={{ marginTop: "0.5rem" }} onClick={fetchResponses}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && responses.length === 0 && (
        <div className="card">
          <p style={{ textAlign: "center", color: "#666" }}>
            No responses yet. <Link href="/">Submit the form</Link> to see responses here.
          </p>
        </div>
      )}

      {!loading && !error && responses.length > 0 && (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Submitted At</th>
                <th>Version</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {responses.map((response) => (
                <tr key={response.id}>
                  <td>
                    <code>{response.id.substring(0, 8)}...</code>
                  </td>
                  <td>{new Date(response.createdAt).toLocaleString()}</td>
                  <td>{response.schemaVersion}</td>
                  <td>
                    <Link
                      href={`/responses/${response.id}`}
                      className="button"
                      style={{ fontSize: "0.875rem", padding: "0.5rem 1rem" }}
                    >
                      View
                    </Link>
                    <button
                      className="button button-secondary"
                      style={{
                        fontSize: "0.875rem",
                        padding: "0.5rem 1rem",
                        marginLeft: "0.5rem",
                      }}
                      onClick={() => deleteResponse(response.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ marginTop: "1rem", color: "#666", fontSize: "0.875rem" }}>
            Total: {responses.length} response{responses.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
}
