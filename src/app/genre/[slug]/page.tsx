import GenreBooksSection from "~/app/_components/layouts/genre/books-section";
import GenreFilterSection from "~/app/_components/layouts/genre/filter-section";
import Header from "~/app/_components/layouts/header";

const GenreRelatedBooks = () => {
  return (
    <>
      <Header />

      <section className="w-full">
        <div className="flex border-b border-border max-w-[1440px] mx-auto px-4 py-10 gap-10">
          {/* Filter actions */}
          <div className="max-w-xs">
            <GenreFilterSection />
          </div>

          {/* Books details */}
          <div className="flex-1">
            <GenreBooksSection />
          </div>
        </div>
      </section>
    </>
  );
};

export default GenreRelatedBooks;
