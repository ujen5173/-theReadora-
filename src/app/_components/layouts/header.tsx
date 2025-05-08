import { Crown, Plus } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import { cn } from "~/lib/utils";
import Logo from "../shared/logo";
import UserHeader from "../user/user-header";
import SearchBar from "./search-bar";

const GENRES = {
  column1: [
    { name: "Romance", href: "/search?genre=romance" },
    { name: "Fantasy", href: "/search?genre=fantasy" },
    { name: "Science Fiction", href: "/search?genre=science-fiction" },
    { name: "Mystery / Thriller", href: "/search?genre=mystery-thriller" },
    { name: "Adventure", href: "/search?genre=adventure" },
  ],
  column2: [
    {
      name: "Drama Fiction",
      href: "/search?genre=drama-realistic-fiction",
    },
    {
      name: "Epic Fantasy",
      href: "/search?genre=high-fantasy-epic-fantasy",
    },
    { name: "LitRPG", href: "/search?genre=litrpg" },
    { name: "Isekai", href: "/search?genre=isekai" },
    {
      name: "Contemporary Romance",
      href: "/search?genre=contemporary-romance",
    },
  ],
  column3: [
    { name: "Enemies to Lovers", href: "/search?genre=enemies-to-lovers" },
    {
      name: "Teen Adult Romance",
      href: "/search?genre=teen-young-adult-romance",
    },
    {
      name: "Anti-Hero Stories",
      href: "/search?genre=villainess-anti-hero-stories",
    },
    { name: "Horror", href: "/search?genre=horror" },
    { name: "Slice of Life", href: "/search?genre=slice-of-life" },
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
  headerExtraStyle,
}: {
  full?: boolean;
  background?: boolean;
  removeBackground?: boolean;
  headerExtraStyle?: string;
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
      <header
        className={cn("w-full", headerExtraStyle, background && "bg-slate-50")}
      >
        <div
          className={cn(
            "mx-auto flex items-center justify-between gap-6 px-4 py-4",
            !full && "max-w-[1440px]"
          )}
        >
          <div className="flex items-center gap-10">
            <Logo />

            <ul className="flex items-center gap-2">
              <NavigationMenu delayDuration={0} className="z-[100] relative">
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
                <Link href="/premium">
                  <Button
                    variant="link"
                    className="text-foreground"
                    icon={Crown}
                    iconPlacement="left"
                  >
                    Get Premium
                  </Button>
                </Link>
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
