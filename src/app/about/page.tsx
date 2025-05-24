import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { generateSEOMetadata } from "~/utils/site";
import Header from "../_components/layouts/header";

export const metadata = generateSEOMetadata({
  title: "About Us",
  description:
    "Learn about Readora's mission, values, and the story behind our storytelling platform.",
});

export default function AboutPage() {
  return (
    <>
      <Header removeBackground />
      <main className="mx-auto max-w-[1540px] px-4 py-16 md:py-24 lg:py-32">
        {/* Hero Section */}
        <section className="mb-24 md:mb-32 flex flex-col items-center text-center">
          <div className="mb-16 space-y-6">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Our <span className="text-primary">Story</span>
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-slate-600 md:text-xl lg:text-2xl leading-relaxed">
              Readora is where imagination meets community, creating a space
              where stories come alive.
            </p>
          </div>
          <div className="relative mb-10 aspect-[21/9] h-auto w-full max-w-6xl overflow-hidden rounded-2xl shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1513001900722-370f803f498d?q=80&w=2574&auto=format&fit=crop"
              alt="People reading and sharing stories"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none"></div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mb-24 md:mb-32 grid gap-16 md:grid-cols-2 lg:gap-24">
          <div className="flex flex-col justify-center space-y-8">
            <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl">
              Our Mission
            </h2>
            <div className="space-y-6 text-slate-600 text-lg">
              <p className="leading-relaxed">
                At Readora, we believe that every person has a story worth
                sharing and every story deserves to find its readers.
              </p>
              <p className="leading-relaxed">
                Our mission is to create the most vibrant and supportive
                platform where writers can freely express their creativity and
                readers can discover captivating stories that move them.
              </p>
              <p className="leading-relaxed">
                We're building more than just another storytelling
                platform—we're nurturing a community where diverse voices are
                celebrated and where the magic of storytelling brings people
                together.
              </p>
            </div>
          </div>
          <div className="relative aspect-square overflow-hidden rounded-2xl shadow-xl md:aspect-auto">
            <Image
              src="https://images.unsplash.com/photo-1519791883288-dc8bd696e667?q=80&w=2530&auto=format&fit=crop"
              alt="Person writing a story"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black/10 pointer-events-none"></div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-24 md:mb-32 py-8">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl lg:text-5xl">
            Our Values
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="overflow-hidden border-none bg-gradient-to-br from-rose-50 to-white shadow-lg transition-all hover:shadow-xl">
              <CardContent className="p-8 lg:p-10">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 text-primary"
                  >
                    <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"></path>
                    <path d="M13.63 8.35c-.94-.46-2.93.03-3.2-1.28-.25-1.28 1.01-2.03 1.01-2.03s-.5-.57-1.85-.08c-1.44.52-1.69 1.82-1.63 2.6.12 1.32 1 2.7 1 2.7s-.24-.02-.65-.02c-1.48 0-2.35.81-2.35 2.13 0 1.27.92 2.27 2.21 2.27.98 0 1.21-.06 1.21-.06-.13.52-.17 1.3.24 1.95.52.8 1.3.76 1.3.76s-.14.28-.14.84c0 .95.8 1.85 1.85 1.85 1.57 0 2.19-1.3 2.19-2.55 0-.43 0-1.3-1.11-2.83-1.32-1.83-.91-2.05-.24-2.12.76-.08 2.06.26 3.06-.77.76-.78.76-1.82.14-2.57-.45-.52-1.42-.71-2.04-.57"></path>
                  </svg>
                </div>
                <h3 className="mb-4 text-2xl font-semibold">Creativity</h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  We foster imagination and originality, encouraging writers to
                  explore new worlds and ideas without limits.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none bg-gradient-to-br from-blue-50 to-white shadow-lg transition-all hover:shadow-xl">
              <CardContent className="p-8 lg:p-10">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 text-primary"
                  >
                    <path d="M12 21a9 9 0 0 0 9-9 9 9 0 0 0-9-9 9 9 0 0 0-9 9 9 9 0 0 0 9 9Z"></path>
                    <path d="M8 10h8"></path>
                    <path d="M8 14h8"></path>
                    <path d="M10 12h4"></path>
                  </svg>
                </div>
                <h3 className="mb-4 text-2xl font-semibold">Freedom</h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  We believe in the power of unrestricted expression and provide
                  tools that liberate rather than constrain.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none bg-gradient-to-br from-purple-50 to-white shadow-lg transition-all hover:shadow-xl">
              <CardContent className="p-8 lg:p-10">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 text-primary"
                  >
                    <path d="M17 7.52 12 2.5 7 7.52"></path>
                    <path d="M12 21v-4"></path>
                    <path d="M12 13V8"></path>
                    <path d="M12 3v1"></path>
                    <path d="M3 12h1"></path>
                    <path d="M8 12h8"></path>
                    <path d="M20 12h1"></path>
                    <path d="m6.35 17.65-.7.7"></path>
                    <path d="m18.35 17.65-.7.7"></path>
                    <path d="m6.35 6.35-.7-.7"></path>
                    <path d="m18.35 6.35-.7-.7"></path>
                  </svg>
                </div>
                <h3 className="mb-4 text-2xl font-semibold">Community</h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  We nurture connections between readers and writers, creating a
                  supportive ecosystem where everyone belongs.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none bg-gradient-to-br from-amber-50 to-white shadow-lg transition-all hover:shadow-xl">
              <CardContent className="p-8 lg:p-10">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 text-primary"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                </div>
                <h3 className="mb-4 text-2xl font-semibold">Innovation</h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  We continuously push boundaries to create a platform that
                  evolves with the changing needs of readers and writers.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* What Sets Us Apart Section */}
        <section className="mb-24 md:mb-32 overflow-hidden rounded-3xl bg-gradient-to-r from-rose-50 via-white to-rose-50 p-10 shadow-xl md:p-16 lg:p-20">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl lg:text-5xl">
            What Sets Us Apart
          </h2>
          <div className="grid gap-12 md:grid-cols-2 lg:gap-16">
            <div className="flex flex-col space-y-8">
              <div className="flex items-start gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="mb-3 text-2xl font-semibold">
                    Reader-First Approach
                  </h3>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    Unlike platforms that prioritize commercialization, we focus
                    on creating the best reading experience possible, with
                    thoughtfully designed interfaces and immersive storytelling
                    features.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="mb-3 text-2xl font-semibold">Modern Design</h3>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    Our clean, intuitive interface puts your stories front and
                    center without distractions or dated design elements,
                    creating an elegant reading and writing experience.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-8">
              <div className="flex items-start gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="mb-3 text-2xl font-semibold">
                    Creator Freedom
                  </h3>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    We give writers more control over their work, with flexible
                    publishing options and better discovery mechanisms that help
                    connect authors with their ideal audiences.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="mb-3 text-2xl font-semibold">
                    Community Integration
                  </h3>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    Our platform encourages meaningful interactions between
                    readers and writers through thoughtful engagement features
                    that foster authentic connection and collaboration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-24 md:mb-32">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl lg:text-5xl">
            The Minds Behind Readora
          </h2>
          <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-3">
            <div className="text-center">
              <div className="relative mx-auto mb-8 h-60 w-60 overflow-hidden rounded-full shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop"
                  alt="Founder & CEO"
                  width={240}
                  height={240}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mb-2 text-2xl font-semibold">Ujen Basi</h3>
              <p className="text-primary text-lg mb-4">Founder & CEO</p>
              <p className="mx-auto max-w-sm text-slate-600 text-lg leading-relaxed">
                Writer and tech enthusiast with a passion for building creative
                communities that empower storytellers worldwide.
              </p>
            </div>
            <div className="text-center">
              <div className="relative mx-auto mb-8 h-60 w-60 overflow-hidden rounded-full shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop"
                  alt="Chief Product Officer"
                  width={240}
                  height={240}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mb-2 text-2xl font-semibold">Sophia Chen</h3>
              <p className="text-primary text-lg mb-4">Chief Product Officer</p>
              <p className="mx-auto max-w-sm text-slate-600 text-lg leading-relaxed">
                Former editor with a vision for creating the perfect platform
                for storytellers to share their unique voices and perspectives.
              </p>
            </div>
            <div className="text-center">
              <div className="relative mx-auto mb-8 h-60 w-60 overflow-hidden rounded-full shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
                  alt="Head of Community"
                  width={240}
                  height={240}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mb-2 text-2xl font-semibold">Miguel Torres</h3>
              <p className="text-primary text-lg mb-4">Head of Community</p>
              <p className="mx-auto max-w-sm text-slate-600 text-lg leading-relaxed">
                Community builder who's dedicated to fostering meaningful
                connections between writers and readers around the globe.
              </p>
            </div>
          </div>
        </section>

        {/* Join Us CTA */}
        <section className="rounded-3xl bg-gradient-to-br from-rose-50 via-rose-100/20 to-white p-12 text-center md:p-20">
          <div className="mx-auto max-w-4xl space-y-8">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl lg:text-5xl">
              Join Our Story
            </h2>
            <p className="mx-auto mb-10 text-xl text-slate-600 leading-relaxed">
              Whether you're a writer looking to share your stories or a reader
              hungry for fresh narratives, Readora is the place where your
              literary journey begins.
            </p>
            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="min-w-44 h-14 text-lg shadow-lg"
              >
                <Link href="/write">Start Writing</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="min-w-44 h-14 text-lg"
              >
                <Link href="/search">Discover Stories</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
