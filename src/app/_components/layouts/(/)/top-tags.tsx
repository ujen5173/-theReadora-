const TopTags = () => {
  const tags: string[] = [
    // "Isekai",
    // "Anime",
    // "Naruto",
    // "Marvel",
    // "Yaoi",
    // "One piece",
    // "Harry potter",
    // "Yuri",
    // "Mha",
    // "Dc",
    // "Pokemon",
    // "Bnha",
    // "Game of thrones",
    // "Danmachi",
  ];
  return (
    <section className="w-full">
      <div className="max-w-[1540px] mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-primary mb-4">
          Top Fanfic Tags
        </h1>
        {tags.length > 0 ? (
          <div className="flex gap-4 flex-wrap">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="bg-white rounded-md px-8 py-4 text-base font-semibold text-primary hover:bg-primary/10 border border-primary/20 shadow-lg transition duration-300 cursor-pointer"
              >
                {tag}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center min-h-40 justify-center w-full h-full">
            <p className="text-gray-600 text-lg font-semibold">
              Not Enough Data to show
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TopTags;
