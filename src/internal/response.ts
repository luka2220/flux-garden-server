// Store operations
interface StatusResponse {
  json(data: Object | null): Response;
  sendStatus(status: number): Response;
  status(status: number): StatusStore;
  text(msg: string): Response;
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
  text(this: StatusStore, msg: string): Response {
    return new Response(msg, {
      status: this.stat,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  },
  sendStatus(this: StatusStore, status: number): Response {
    return new Response(null, {
      status,
      headers: { "Content-Type": "text/plain" },
    });
  },
  status(this: StatusStore, status: number): StatusStore {
    this.stat = status;
    return this;
  },
};
