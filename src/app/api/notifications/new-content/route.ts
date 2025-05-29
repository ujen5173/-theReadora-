import { NextResponse } from "next/server";
import { z } from "zod";
import { sendNewContentEmail } from "~/lib/email/sendEmail";

const newContentSchema = z.object({
  userEmail: z.string().email(),
  authorName: z.string().min(1),
  contentTitle: z.string().min(1),
  contentType: z.enum(["chapter", "story"]),
  contentUrl: z.string().url(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = newContentSchema.parse(body);

    const result = await sendNewContentEmail(validatedData);

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to send new content notification" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
