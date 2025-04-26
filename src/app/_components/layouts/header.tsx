import Logo from "../shared/logo";
import { Button, buttonVariants } from "~/components/ui/button";
import { Crown, Plus } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import { cn } from "~/lib/utils";
import Link from "next/link";
import UserHeader from "../user/user-header";
import SearchBar from "./search-bar";

// Genre list for explore dropdown
const GENRES = {
  column1: [
    { name: "Romance", href: "/search?genre=romance" },
    { name: "Fanfiction", href: "/search?genre=fanfiction" },
    { name: "LGBTQ+", href: "/search?genre=lgbtq" },
    { name: "Werewolf", href: "/search?genre=werewolf" },
    { name: "Contemporary Lit", href: "/search?genre=contemporary" },
  ],
  column2: [
    { name: "New Adult", href: "/search?genre=new-adult" },
    { name: "Fantasy", href: "/search?genre=fantasy" },
    { name: "Short Story", href: "/search?genre=short-story" },
    { name: "Teen Fiction", href: "/search?genre=teen-fiction" },
    { name: "Historical Fiction", href: "/search?genre=historical-fiction" },
  ],
  column3: [
    { name: "Paranormal", href: "/search?genre=paranormal" },
    { name: "Editor's Picks", href: "/search?genre=editors-picks" },
    { name: "Humor", href: "/search?genre=humor" },
    { name: "Horror", href: "/search?genre=horror" },
  ],
};

const GenreColumn = ({
  genres,
}: {
  genres: { name: string; href: string }[];
}) => (
  <div className="w-40">
    <ul>
      {genres.map((genre) => (
        <li key={genre.name}>
          <NavigationMenuLink
            href={genre.href}
            className="block py-2 hover:text-primary text-slate-700 font-medium"
          >
            {genre.name}
          </NavigationMenuLink>
        </li>
      ))}
    </ul>
  </div>
);

const Header = ({
  full = false,
  background = false,
  removeBackground = false,
}: {
  full?: boolean;
  background?: boolean;
  removeBackground?: boolean;
}) => {
  return (
    <>
      {!removeBackground && (
        <>
          <div className="fixed -z-10 h-screen w-full bg-gradient-to-br from-primary/20 via-white to-primary/10"></div>
          <div
            className="fixed -z-10 h-screen w-full opacity-30"
            style={{
              backgroundImage: "url(/ooorganize.svg)",
              backgroundBlendMode: "overlay",
              backgroundAttachment: "fixed",
              backgroundSize: "cover",
            }}
          ></div>
        </>
      )}
      <header className={cn("w-full", background && "bg-slate-50")}>
        <div
          className={cn(
            "mx-auto flex items-center justify-between gap-6 px-4 py-4",
            !full && "max-w-[1440px]"
          )}
        >
          <div className="flex items-center gap-10">
            <Logo />

            <ul className="flex items-center gap-2">
              <NavigationMenu delayDuration={0} className="relative">
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={cn(
                        buttonVariants({ variant: "link" }),
                        "text-foreground bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent"
                      )}
                    >
                      Explore
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-white shadow-lg rounded-lg p-4 transition duration-150 ease-in-out">
                      <div className="flex mb-2 items-center px-2 justify-between">
                        <h3 className="text-lg font-bold text-slate-700">
                          Genres
                        </h3>
                      </div>
                      <div className="flex space-x-6">
                        <GenreColumn genres={GENRES.column1} />
                        <GenreColumn genres={GENRES.column2} />
                        <GenreColumn genres={GENRES.column3} />
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              <li>
                <Button
                  variant="link"
                  className="text-foreground"
                  icon={Crown}
                  iconPlacement="left"
                >
                  Get Premium
                </Button>
              </li>
              <li>
                <Link href="/write">
                  <Button variant="link" icon={Plus} iconPlacement="left">
                    Write something
                  </Button>
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex items-center gap-2">
            <SearchBar />
            <UserHeader />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
