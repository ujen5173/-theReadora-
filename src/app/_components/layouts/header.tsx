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
    { name: "Romance", href: "/genre/romance" },
    { name: "Fanfiction", href: "/genre/fanfiction" },
    { name: "LGBTQ+", href: "/genre/lgbtq" },
    { name: "Werewolf", href: "/genre/werewolf" },
    { name: "Contemporary Lit", href: "/genre/contemporary" },
  ],
  column2: [
    { name: "New Adult", href: "/genre/new-adult" },
    { name: "Fantasy", href: "/genre/fantasy" },
    { name: "Short Story", href: "/genre/short-story" },
    { name: "Teen Fiction", href: "/genre/teen-fiction" },
    { name: "Historical Fiction", href: "/genre/historical-fiction" },
  ],
  column3: [
    { name: "Paranormal", href: "/genre/paranormal" },
    { name: "Editor's Picks", href: "/genre/editors-picks" },
    { name: "Humor", href: "/genre/humor" },
    { name: "Horror", href: "/genre/horror" },
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

const Header = ({ background = false }: { background?: boolean }) => {
  return (
    <header className={cn("w-full", background && "bg-slate-50")}>
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-6 px-4 py-4">
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
  );
};

export default Header;
