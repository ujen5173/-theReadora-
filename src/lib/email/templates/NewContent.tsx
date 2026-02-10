import { Body, Head, Html, Preview } from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

const NewContent = () => {
  return (
    <Html>
      <Head />
      <Preview>New Story uploaded</Preview>
      <Tailwind>
        <Body className="bg-[#fff0f3] min-h-screen">
          <div className="bg-white mx-auto max-w-[700px]">
            <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] px-10 py-9 overflow-hidden">
              <div className="z-10 relative">
                <div className="flex items-center gap-2 font-bold text-[28px] text-white tracking-tight">
                  [theReadora]
                  <span className="bg-gradient-to-br from-[#ec003f] to-[#ad1457] px-2 py-1 rounded font-bold text-[10px] tracking-widest">
                    BETA
                  </span>
                </div>
                <p className="mt-1 text-white/70 text-sm">
                  Where stories come alive
                </p>
              </div>

              <div className="right-0 absolute inset-y-0 bg-gradient-to-l from-[#d81b601a] to-transparent w-[200px]"></div>
            </div>

            <div className="px-6 py-8">
              <div className="bg-gradient-to-br from-[#fff5f7] to-[#ffe8ed] mb-6 px-6 py-5 border-[#ec003f] border-l-4 rounded-r-lg">
                <p className="mb-2 font-bold text-[#ec003f] text-xs uppercase tracking-widest">
                  Fresh Release
                </p>
                <p className="text-[15px] text-gray-700 leading-relaxed">
                  A brand new story just dropped on theReadora. We think you'll
                  love this one.
                </p>
              </div>

              <div className="bg-white shadow-lg shadow-pink-200/40 rounded-lg overflow-hidden">
                <div className="bg-gradient-to-b from-white to-gray-50 p-6">
                  <div className="flex gap-5">
                    <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] rounded-xl w-[180px] overflow-hidden">
                      <img
                        src="https://res.cloudinary.com/duig8qiu4/image/upload/c_limit,w_1200/f_auto/q_auto/v1770309315/ChatGPT_Image_Jan_31_2026_11_14_50_PM_ot3wok?_a=BAVMn6AQ0"
                        alt="The Man Who Loved Like a Crime"
                        className="w-full h-full object-cover"
                      />
                      <span className="top-4 left-4 absolute bg-black/80 backdrop-blur px-4 py-2 rounded-lg font-bold text-[11px] text-white uppercase tracking-widest">
                        New Release
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-gradient-to-br from-[#ffe8ed] to-[#ffd6e0] px-4 py-2 rounded-md font-bold text-[#ad1457] text-xs uppercase tracking-wide">
                          Romance
                        </span>
                        <span className="bg-[#ec003f] px-4 py-2 rounded-md font-bold text-white text-xs uppercase tracking-wide">
                          18+
                        </span>
                      </div>

                      <h1 className="font-['Cormorant_Garamond'] font-bold text-[42px] text-gray-900 leading-tight tracking-tight">
                        The Man Who Loved Like a Crime
                      </h1>

                      <p className="mt-4 pb-6 border-b text-gray-500">
                        By
                        <a
                          href="https://thereadora.vercel.app/profile?user=novel-godddess"
                          target="_blank"
                          className="font-bold text-[#ec003f]"
                        >
                          Novel Goddess
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="gap-4 grid grid-cols-2 mt-8">
                    <div className="bg-gradient-to-br from-[#fff9fa] to-[#fff5f7] p-5 border border-pink-100 rounded-xl text-center">
                      <span className="block font-bold text-[#ec003f] text-3xl">
                        1
                      </span>
                      <span className="font-semibold text-gray-500 text-xs uppercase tracking-widest">
                        Chapter
                      </span>
                    </div>
                    <div className="bg-gradient-to-br from-[#fff9fa] to-[#fff5f7] p-5 border border-pink-100 rounded-xl text-center">
                      <span className="block font-bold text-[#ec003f] text-3xl">
                        3 min
                      </span>
                      <span className="font-semibold text-gray-500 text-xs uppercase tracking-widest">
                        Read Time
                      </span>
                    </div>
                  </div>

                  <p className="mt-8 text-[16px] text-gray-600 leading-8">
                    <strong className="text-gray-800">Nyra Cole</strong> never
                    thought a single glance could upend her carefully controlled
                    life—until she meets
                    <strong className="text-gray-800">Lucien Black</strong>, a
                    man whose presence commands a room and whose eyes hide
                    dangerous secrets.
                    <br />
                    <br />
                    Drawn to him despite every warning, Nyra quickly discovers
                    that Lucien isn't just a mysterious stranger—he's a powerful
                    mafia boss whose world is ruled by loyalty, fear, and
                    violence.
                  </p>

                  <div className="mt-10 text-center">
                    <a
                      href="https://thereadora.vercel.app/story/the-man-who-loved-like-a-crime"
                      className="inline-block bg-[#ec003f] hover:bg-gradient-to-br hover:from-[#c2185b] hover:to-[#ad1457] shadow-lg shadow-pink-400/40 px-12 py-4 rounded-xl font-bold text-[16px] text-white tracking-wide transition hover:-translate-y-0.5"
                    >
                      Start Reading Now
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#fff9fa] to-[#fff5f7] px-10 py-12 border-pink-100 border-t text-center">
              <h2 className="font-['Cormorant_Garamond'] font-bold text-gray-900 text-3xl">
                Discover More Stories
              </h2>
              <p className="mt-3 text-gray-500">
                Browse our growing collection of captivating tales
              </p>
              <a
                href="https://thereadora.vercel.app/search"
                className="inline-block hover:bg-[#ec003f] mt-6 px-8 py-3 border-[#ec003f] border-2 rounded-lg font-bold text-[#ec003f] hover:text-white transition"
              >
                Explore Stories
              </a>
            </div>

            <div className="bg-gradient-to-br from-[#1a1a1a] to-black px-6 py-8 text-white">
              <div className="mb-8 pb-6 border-white/10 border-b text-center">
                <p className="font-bold text-2xl">[theReadora]</p>
                <p className="mx-auto mt-3 max-w-md text-white/60 text-sm">
                  A creator-first platform for readers and writers. Share
                  stories, grow your audience, and enjoy storytelling without
                  the hassles.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-8 mb-6">
                <a
                  href="#"
                  className="font-semibold text-white/80 hover:text-[#ec003f]"
                >
                  Explore Stories
                </a>
                <a
                  href="#"
                  className="font-semibold text-white/80 hover:text-[#ec003f]"
                >
                  Start Writing
                </a>
              </div>

              <p className="text-white/40 text-xs text-center">
                You're receiving this because you signed up for new story
                notifications
              </p>
            </div>
          </div>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default NewContent;
