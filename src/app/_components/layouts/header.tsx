"use client";

import {
  CrownIcon,
  Home01Icon,
  Menu01Icon,
  QuillWrite02Icon,
} from "hugeicons-react";
import Link from "next/link";
import { Button, buttonVariants } from "~/components/ui/button";
import { Kbd } from "~/components/ui/kbd";
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
import { useUserStore } from "~/store/userStore";
import Logo from "../shared/logo";
import UserHeader from "../user/user-header";
import SearchBar from "./search-bar";

const GENRES = {
  column1: [
    { name: "Romance", href: "/search?genre=romance" },
    { name: "Fantasy", href: "/search?genre=fantasy" },
    { name: "Science Fiction", href: "/search?genre=science-fiction" },
    { name: "Mystery Thriller", href: "/search?genre=mystery-thriller" },
    { name: "Young Adult", href: "/search?genre=young-adult" },
  ],
  column2: [
    { name: "Historical Fiction", href: "/search?genre=historical-fiction" },
    { name: "Action Adventure", href: "/search?genre=action-adventure" },
    { name: "Urban Fiction", href: "/search?genre=urban-fiction" },
    { name: "Horror Paranormal", href: "/search?genre=horror-paranormal" },
    { name: "Fanfiction", href: "/search?genre=fanfiction" },
  ],
  column3: [
    { name: "Slice of Life", href: "/search?genre=slice-of-life" },
    { name: "Drama", href: "/search?genre=drama" },
    { name: "Comedy", href: "/search?genre=comedy" },
    { name: "Wuxia Xianxia", href: "/search?genre=wuxia-xianxia" },
    { name: "LGBTQ Fiction", href: "/search?genre=lgbtq-fiction" },
  ],
  column4: [
    { name: "Reincarnation", href: "/search?genre=reincarnation" },
    { name: "Supernatural", href: "/search?genre=supernatural" },
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
            className="block py-1.5 sm:py-2 font-medium text-slate-700 hover:text-primary text-sm sm:text-base"
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
          variant="ghost"
          size="icon"
          className="lg:hidden"
        />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex flex-col p-0 w-[280px] sm:w-[320px]"
      >
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>

        <div className="p-4 pt-0 border-b">
          <SearchBar size="sm" />
        </div>

        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-1 p-4">
              <h3 className="mb-2 font-semibold text-muted-foreground text-sm">
                Navigation
              </h3>
              <Link href="/">
                <Button
                  variant="ghost"
                  className="justify-start w-full text-sm"
                  icon={Home01Icon}
                  iconPlacement="left"
                >
                  Home
                </Button>
              </Link>
              <Link href="/premium">
                <Button
                  variant="ghost"
                  className="justify-start w-full text-sm"
                  icon={CrownIcon}
                  iconPlacement="left"
                >
                  Get Premium
                </Button>
              </Link>
              <Link href="/write">
                <Button
                  variant="ghost"
                  className="justify-start w-full text-sm"
                  icon={QuillWrite02Icon}
                  iconPlacement="left"
                >
                  Write something
                </Button>
              </Link>
            </div>

            <div className="p-4">
              <h3 className="mb-2 font-semibold text-muted-foreground text-sm">
                Genres
              </h3>
              <div className="space-y-1">
                {Object.values(GENRES)
                  .flat()
                  .map((genre) => (
                    <Link
                      key={genre.name}
                      href={genre.href}
                      className="block hover:bg-slate-100 px-2 py-1.5 rounded-md text-slate-700 hover:text-primary text-sm transition-colors"
                    >
                      {genre.name}
                    </Link>
                  ))}
              </div>
            </div>
          </div>

          <div className="mt-auto p-4 border-t">
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
  const { user } = useUserStore();

  return (
    <>
      {!removeBackground && (
        <>
          <div className="-z-10 fixed inset-0 bg-gradient-to-br from-primary/20 via-white to-primary/10"></div>
          <div
            className="-z-10 fixed inset-0 opacity-30"
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
        className={cn(
          "z-30 relative w-full",
          headerExtraStyle,
          background && "bg-slate-50",
        )}
      >
        <div
          className={cn(
            "flex justify-between items-center gap-3 sm:gap-6 mx-auto px-3 sm:px-4 py-3 sm:py-4",
            !full && "max-w-[1540px]",
          )}
        >
          <div className="flex items-center gap-4 sm:gap-10">
            <div className="flex items-center gap-2">
              <MobileMenu />
              <div className="flex items-start gap-2">
                <Logo />
                <Kbd variant="beta-label">Beta</Kbd>
              </div>
            </div>

            <ul className="hidden lg:flex items-center gap-1 sm:gap-2">
              <li>
                <NavigationMenu delayDuration={0} className="z-[100] relative">
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <Link href="/search">
                        <NavigationMenuTrigger
                          className={cn(
                            buttonVariants({ variant: "link" }),
                            "text-foreground bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent text-sm sm:text-base",
                          )}
                        >
                          Explore
                        </NavigationMenuTrigger>
                      </Link>
                      <NavigationMenuContent className="bg-white shadow-lg p-3 sm:p-4 rounded-lg transition duration-150 ease-in-out">
                        <div className="flex justify-between items-center mb-2 px-2">
                          <h3 className="font-bold text-slate-700 text-base sm:text-lg">
                            Genres
                          </h3>
                        </div>
                        <div className="flex sm:flex-row flex-col sm:space-x-4 space-y-4 sm:space-y-0">
                          <GenreColumn genres={GENRES.column1} />
                          <GenreColumn genres={GENRES.column2} />
                          <GenreColumn genres={GENRES.column3} />
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </li>

              <li className="block">
                <Link href="/premium">
                  <Button
                    variant="link"
                    className="text-foreground text-sm sm:text-base"
                    icon={CrownIcon}
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
                    icon={QuillWrite02Icon}
                    iconPlacement="left"
                    className="text-sm sm:text-base"
                  >
                    Write something
                  </Button>
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-1 justify-end items-center gap-2">
            {user && (
              <div className="md:hidden block">
                <Button size="xs" asChild>
                  <Link href="/studio">Studio</Link>
                </Button>
              </div>
            )}
            <div className="hidden lg:flex flex-1 justify-end">
              <SearchBar size="md" />
            </div>
            <UserHeader />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
