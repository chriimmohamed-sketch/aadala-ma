export default {
  // eslint-disable-next-line no-unused-vars
  async fetch(request: Request, env: unknown): Promise<Response> {
    // eslint-disable-next-line no-unused-vars
    return new Response('AADALA Worker', { status: 200 });
  },
};
