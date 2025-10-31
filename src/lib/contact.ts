export interface ContactFormPayload {
  name: string;
  email: string;
  phone: string;
  message: string;
  botField?: string;
}

const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined;
const REQUEST_TIMEOUT_MS = 10000;

export class ContactRequestError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = "ContactRequestError";
  }
}

export async function submitContactRequest(payload: ContactFormPayload): Promise<void> {
  if (!CONTACT_ENDPOINT) {
    throw new ContactRequestError("CONTACT_ENDPOINT_NOT_CONFIGURED");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(CONTACT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
      credentials: "omit",
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      throw new ContactRequestError(
        errorBody || `Request failed with status ${response.status}`,
        response.status,
      );
    }
  } catch (error) {
    if (error instanceof ContactRequestError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ContactRequestError("REQUEST_TIMEOUT");
    }

    throw new ContactRequestError(
      error instanceof Error ? error.message : "UNKNOWN_ERROR",
    );
  } finally {
    clearTimeout(timeout);
  }
}
