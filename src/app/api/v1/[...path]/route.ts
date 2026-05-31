const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function proxy(request: Request, path: string[]) {
  const url = `${BACKEND_BASE_URL}/api/v1/${path.join("/")}`;
  const headers = new Headers(request.headers);
  headers.delete("host");

  const hasBody = !["GET", "HEAD"].includes(request.method);
  const body = hasBody ? await request.text() : undefined;

  const response = await fetch(url, {
    method: request.method,
    headers,
    body,
    cache: "no-store",
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}

export async function GET(request: Request, context: { params: { path: string[] } }) {
  return proxy(request, context.params.path);
}

export async function POST(request: Request, context: { params: { path: string[] } }) {
  return proxy(request, context.params.path);
}

export async function PUT(request: Request, context: { params: { path: string[] } }) {
  return proxy(request, context.params.path);
}

export async function PATCH(request: Request, context: { params: { path: string[] } }) {
  return proxy(request, context.params.path);
}

export async function DELETE(request: Request, context: { params: { path: string[] } }) {
  return proxy(request, context.params.path);
}
