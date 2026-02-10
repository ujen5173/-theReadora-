import { NextResponse } from "next/server";
import { z } from "zod";
import { sendBulkEmailToAll } from "~/lib/email/sendEmail";

export async function POST(req: Request) {
  try {
    const result = await sendBulkEmailToAll();

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to send new content notification" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
