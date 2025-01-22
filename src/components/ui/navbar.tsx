"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import DarkModeToggle from "./dark-mode-toggle";

export default function Navbar() {
  const [state, setState] = React.useState(false);
  const pathname = usePathname();

  const menus = [
    { title: "Home", path: "/" },
    { title: "Explore", path: "/items" },
    { title: "About", path: "/about" },
  ];

  return (
    <nav className="w-full border-b md:border-0">
      <div className="items-center px-4 max-w-screen-2xl mx-auto md:flex md:px-8">
        <div className="flex items-center justify-between py-3 md:py-5 md:block">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="PPMExplorer" width={50} height={50} />
            <span className="text-2xl font-serif">PPMExplorer</span>
          </Link>
          <div className="md:hidden">
            <Button variant="secondary" onClick={() => setState(!state)}>
              <Menu />
            </Button>
          </div>
        </div>
        <div
          className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
            state ? "block" : "hidden"
          }`}
        >
          <ul className="justify-end items-center space-y-8 md:flex md:space-x-6 md:space-y-0">
            {menus.map((item, idx) => (
              <li
                key={idx}
                className={`text-primary hover:text-accent ${
                  pathname === item.path ? "font-bold" : ""
                }`}
              >
                <Link href={item.path}>{item.title}</Link>
              </li>
            ))}
            <DarkModeToggle />
          </ul>
        </div>
      </div>
    </nav>
  );
}
