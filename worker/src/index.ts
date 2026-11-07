type Env = Record<string, unknown>;

const handler = {
  async fetch(request: Request, env: Env): Promise<Response> {
    void request; void env;
    return new Response("AADALA Worker", { status: 200 });
  },
};

export default handler;