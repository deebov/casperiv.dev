"use client";

import classNames from "classnames";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  const isArticle = ["blog", "snippets", "project"].some((path) =>
    pathname.startsWith(`/${path}/`),
  );

  return (
    <footer className="flex items-center justify-center w-full sm:h-40 px-5 pb-10 sm:pb-5 pt-8">
      <div
        className={classNames(
          "flex flex-col sm:flex-row items-center justify-between w-full sm:h-40 max-w-6xl",
          isArticle ? "max-w-3xl" : "max-w-6xl",
        )}
      >
        <p className="text-center sm:text-left mb-5 font-poppins font-medium">
          Created by{" "}
          <FooterLink href="https://github.com/dev-caspertheghost/casperiv.dev">Casper</FooterLink>{" "}
          with ❤️
          <br />
          Built with <FooterLink href="https://nextjs.org">Next.js</FooterLink>
        </p>

        <div className="flex flex-col md:flex-row md:gap-2">
          <FooterLink href="https://twitter.com/casper124578">Twitter</FooterLink>
          <FooterLink href="https://github.com/dev-caspertheghost">GitHub</FooterLink>
          <FooterLink href="https://www.linkedin.com/in/casper-iversen">LinkedIn</FooterLink>
          <FooterLink href="https://npmjs.org/~casper124578">npm</FooterLink>
        </div>
      </div>
    </footer>
  );
}

interface FooterLinkProps {
  href: string;
  children: string;
}

function FooterLink({ children, href }: FooterLinkProps) {
  return (
    <a className="underline" target="_blank" href={href} rel="noreferrer">
      {children}
    </a>
  );
}
