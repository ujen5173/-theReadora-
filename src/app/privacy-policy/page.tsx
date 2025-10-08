import { getMarkdownContent } from "~/lib/markdown";
import "~/styles/markdown.css";
import { generateSEOMetadata } from "~/utils/site";
import Header from "../_components/layouts/header";

export const metadata = generateSEOMetadata({
  title: "Privacy Policy",
  description: "Readora’s privacy policy.",
  pathname: "/privacy-policy",
  noIndex: false,
  type: "article",
});

export default async function PrivacyPolicy() {
  const content = await getMarkdownContent("privacy-policy.md");

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
