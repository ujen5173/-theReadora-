import {
  Facebook01Icon,
  Idea01Icon,
  InstagramIcon,
  PinterestIcon,
  TwitterIcon,
} from "hugeicons-react";
import Link from "next/link";
import { Button, buttonVariants } from "~/components/ui/button";
import Logo from "./logo";
import { navigationLinks, siteConfig } from "~/utils/site";
import FeedbackDialog from "./feedback";

const Footer = () => {
  return (
    <footer className="w-full">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-8 px-4 py-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="grid-cols-2">
            <Link href="/" className="mb-4 mr-6 flex w-fit items-end gap-1">
              <Logo />
            </Link>
            <p className="text-text-light mb-2 text-sm">{siteConfig.title}</p>
            <p className="text-text-light mb-4 text-sm">
              {siteConfig.description}
            </p>
            <FeedbackDialog>
              <Button className="mb-5 gap-2">
                <Idea01Icon className="text-danger" size={18} />
                <span className="text-sm">Any feedback?</span>
              </Button>
            </FeedbackDialog>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {Object.entries(navigationLinks.footer).map(([title, links]) => (
              <div key={title} className="flex-1">
                <h1 className="mb-2 text-base capitalize font-semibold text-slate-800">
                  {title}
                </h1>
                <ul>
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-text-light inline-block py-1 text-sm text-slate-700 hover:text-slate-800 hover:underline"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="mb-2 text-base capitalize font-semibold text-slate-800">
              Follow Us <span className="lowercase">on</span>
            </h1>
            <ul className="flex items-center gap-2">
              <li>
                <Link
                  href={siteConfig.links.discord}
                  className={buttonVariants({
                    variant: "outline",
                    size: "icon",
                  })}
                >
                  <PinterestIcon className="text-primary" />
                </Link>
              </li>
              <li>
                <Link
                  href={siteConfig.links.discord}
                  className={buttonVariants({
                    variant: "outline",
                    size: "icon",
                  })}
                >
                  <InstagramIcon className="text-primary" />
                </Link>
              </li>
              <li>
                <Link
                  href={siteConfig.links.discord}
                  className={buttonVariants({
                    variant: "outline",
                    size: "icon",
                  })}
                >
                  <Facebook01Icon className="text-primary" />
                </Link>
              </li>
              <li>
                <Link
                  href={siteConfig.links.discord}
                  className={buttonVariants({
                    variant: "outline",
                    size: "icon",
                  })}
                >
                  <TwitterIcon className="text-primary" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full border-t border-border p-4">
          <p className="text-text-secondary text-center text-sm">
            &copy; {new Date().getFullYear()} {siteConfig.title}. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
