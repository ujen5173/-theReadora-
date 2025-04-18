import { Input } from "~/components/ui/input";
import Logo from "../shared/logo";
import { Button } from "~/components/ui/button";
import { Crown, Plus } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";

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

// for search input
const KbdIcon = () => (
  <kbd className="pointer-events-none hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
    <span className="text-xs mt-1">⌘</span>K
  </kbd>
);

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
            className="block py-2 hover:text-primary font-medium"
          >
            {genre.name}
          </NavigationMenuLink>
        </li>
      ))}
    </ul>
  </div>
);

const Header = () => {
  return (
    <header className="w-full">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-6 px-4 py-4">
        <div className="flex items-center gap-6">
          <Logo />
          <ul className="flex items-center">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="transition duration-200 ease-in-out hover:text-primary">
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
              <Button variant="ghost" icon={Crown} iconPlacement="left">
                Get Premium
              </Button>
            </li>
            <li>
              <Button variant="link" icon={Plus} iconPlacement="left">
                Write something
              </Button>
            </li>
          </ul>
        </div>
        <div className="flex items-center gap-2">
          <Input
            size="lg"
            placeholder="Search..."
            icon={KbdIcon}
            className="w-80"
            iconPlacement="right"
          />
          <Button>Sign in</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
