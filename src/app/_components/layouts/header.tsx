import { Menu01Icon } from "hugeicons-react";
import { Crown, Home, Plus } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
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
  <div className="w-full sm:w-40">
    <ul>
      {genres.map((genre) => (
        <li key={genre.name}>
          <NavigationMenuLink
            href={genre.href}
            className="block py-1.5 sm:py-2 hover:text-primary text-slate-700 font-medium text-sm sm:text-base"
          >
            {genre.name}
          </NavigationMenuLink>
        </li>
      ))}
    </ul>
  </div>
);

const MobileMenu = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          icon={Menu01Icon}
          variant="secondary"
          size="icon"
          className="lg:hidden"
        />
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[280px] sm:w-[320px] p-0 flex flex-col"
      >
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>

        {/* Search Bar at the top */}
        <div className="p-4 pt-0 border-b">
          <SearchBar size="sm" />
        </div>

        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-1">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                Navigation
              </h3>
              <Link href="/">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  icon={Home}
                  iconPlacement="left"
                >
                  Home
                </Button>
              </Link>
              <Link href="/premium">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  icon={Crown}
                  iconPlacement="left"
                >
                  Get Premium
                </Button>
              </Link>
              <Link href="/write">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  icon={Plus}
                  iconPlacement="left"
                >
                  Write something
                </Button>
              </Link>
            </div>

            {/* Genres Section */}
            <div className="p-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                Genres
              </h3>
              <div className="space-y-1">
                {Object.values(GENRES)
                  .flat()
                  .map((genre) => (
                    <Link
                      key={genre.name}
                      href={genre.href}
                      className="block px-2 py-1.5 text-sm text-slate-700 hover:text-primary hover:bg-slate-100 rounded-md transition-colors"
                    >
                      {genre.name}
                    </Link>
                  ))}
              </div>
            </div>
          </div>

          {/* User Section - Fixed at bottom */}
          <div className="p-4 border-t mt-auto">
            <UserHeader fromMobileMenu />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

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
            "mx-auto flex items-center justify-between gap-3 sm:gap-6 px-3 sm:px-4 py-3 sm:py-4",
            !full && "max-w-[1440px]"
          )}
        >
          <div className="flex items-center gap-4 sm:gap-10">
            <div className="flex items-center gap-2">
              <MobileMenu />
              <Logo />
            </div>

            <ul className="hidden lg:flex items-center gap-1 sm:gap-2">
              <NavigationMenu delayDuration={0} className="z-[100] relative">
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={cn(
                        buttonVariants({ variant: "link" }),
                        "text-foreground bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent text-sm sm:text-base"
                      )}
                    >
                      Explore
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-white shadow-lg rounded-lg p-3 sm:p-4 transition duration-150 ease-in-out">
                      <div className="flex mb-2 items-center px-2 justify-between">
                        <h3 className="text-base sm:text-lg font-bold text-slate-700">
                          Genres
                        </h3>
                      </div>
                      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <GenreColumn genres={GENRES.column1} />
                        <GenreColumn genres={GENRES.column2} />
                        <GenreColumn genres={GENRES.column3} />
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              <li className="block">
                <Link href="/premium">
                  <Button
                    variant="link"
                    className="text-foreground text-sm sm:text-base"
                    icon={Crown}
                    iconPlacement="left"
                  >
                    Get Premium
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/write">
                  <Button
                    variant="link"
                    icon={Plus}
                    iconPlacement="left"
                    className="text-sm sm:text-base"
                  >
                    Write something
                  </Button>
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex items-center flex-1 justify-end gap-2">
            <div className="flex-1 lg:flex justify-end hidden">
              <SearchBar />
            </div>

            <UserHeader />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
