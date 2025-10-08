import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

// Force Node.js runtime for cookie operations

export const POST = async (req: NextRequest) => {
  const request = (await req.json()) as { ref?: string | null };

  const ref = request.ref;

  if (ref) (await cookies()).set("ref", ref);

  return Response.json({ message: "ref set" });
};
