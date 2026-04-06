import { describe, it, expect, vi, beforeEach } from "vitest";
import { createWebhookAdapter } from "../src/webhook-adapter";
import type { FormResponse } from "@squaredr/formengine-core";

const mockResponse: FormResponse = {
  schemaId: "s1",
  schemaVersion: "1.0.0",
  submittedAt: new Date().toISOString(),
  sessionToken: "sess1",
  values: { name: "Alice" },
};

describe("createWebhookAdapter", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("has name 'webhook'", () => {
    const adapter = createWebhookAdapter({
      url: "https://example.com/hook",
      secret: "my-secret",
    });
    expect(adapter.name).toBe("webhook");
  });

  it("sends POST with HMAC signature on success", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve(""),
    });
    vi.stubGlobal("fetch", mockFetch);

    const onSuccess = vi.fn();
    const adapter = createWebhookAdapter({
      url: "https://example.com/hook",
      secret: "my-secret",
      onSuccess,
    });

    await adapter.submit(mockResponse);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe("https://example.com/hook");
    expect(options.method).toBe("POST");
    expect(options.headers["Content-Type"]).toBe("application/json");
    expect(options.headers["X-FormEngine-Signature"]).toMatch(
      /^sha256=[a-f0-9]{64}$/,
    );
    expect(options.headers["X-FormEngine-Event"]).toBe("submit");
    expect(onSuccess).toHaveBeenCalledWith(mockResponse, 200);
  });

  it("applies custom transform", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve(""),
    });
    vi.stubGlobal("fetch", mockFetch);

    const adapter = createWebhookAdapter({
      url: "https://example.com/hook",
      secret: "s",
      transform: (r) => ({ custom: true, id: r.schemaId }),
    });

    await adapter.submit(mockResponse);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body).toEqual({ custom: true, id: "s1" });
  });

  it("retries on failure and eventually throws", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      text: () => Promise.resolve(""),
    });
    vi.stubGlobal("fetch", mockFetch);

    const onError = vi.fn();
    const onRetry = vi.fn();
    const adapter = createWebhookAdapter({
      url: "https://example.com/hook",
      secret: "s",
      retries: 2,
      retryDelayMs: 1, // 1ms for fast tests
      retryBackoff: "linear",
      onError,
      onRetry,
    });

    await expect(adapter.submit(mockResponse)).rejects.toThrow(
      "Webhook returned 500",
    );

    // 1 initial + 2 retries = 3 total calls
    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(onError).toHaveBeenCalledTimes(3);
    expect(onRetry).toHaveBeenCalledTimes(2);
  });

  it("succeeds on retry after initial failure", async () => {
    let callCount = 0;
    const mockFetch = vi.fn().mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return Promise.resolve({
          ok: false,
          status: 502,
          statusText: "Bad Gateway",
          text: () => Promise.resolve(""),
        });
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        text: () => Promise.resolve(""),
      });
    });
    vi.stubGlobal("fetch", mockFetch);

    const onSuccess = vi.fn();
    const adapter = createWebhookAdapter({
      url: "https://example.com/hook",
      secret: "s",
      retries: 2,
      retryDelayMs: 1,
      onSuccess,
    });

    await adapter.submit(mockResponse);

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(onSuccess).toHaveBeenCalledWith(mockResponse, 200);
  });
});
