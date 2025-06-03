import { type Metadata } from "next";
import { getMarkdownContent } from "~/lib/markdown";
import "~/styles/markdown.css";
import Header from "../_components/layouts/header";

export const metadata: Metadata = {
  title: "Terms Of Use - Readora",
  description:
    "Readora Terms Of Use - Learn how we collect, use, and protect your personal information.",
};

export default async function TermsOfUse() {
  const content = await getMarkdownContent("terms-of-use.md");

  return (
    <>
      <Header removeBackground headerExtraStyle="border-b border-border" />
      <main className="bg-white min-h-screen">
        <div className="max-w-[1540px] mx-auto pb-10 px-4">
          <article className="markdown">
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </article>
        </div>
      </main>
    </>
  );
}
