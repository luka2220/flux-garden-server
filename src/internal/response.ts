// Store operations
interface StatusResponse {
  json(data: Object | null): Response;
  sendStatus(status: number): Response;
  statusText(data: string): Response;
  status(status: number): StatusStore;
}

// Store data
interface StatusStore extends StatusResponse {
  stat: number;
}

export const Resp: StatusStore = {
  stat: 200, // default status
  json(this: StatusStore, data: Object | null): Response {
    return new Response(JSON.stringify(data), {
      status: this.stat,
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  sendStatus(this: StatusStore, status: number): Response {
    return new Response(null, {
      status,
      headers: { "Content-Type": "text/plain" },
    });
  },
  statusText(this: StatusStore, data: string): Response {
    return new Response(null, {
      status: this.stat,
      statusText: data,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  },
  status(this: StatusStore, status: number): StatusStore {
    this.stat = status;
    return this;
  },
};
