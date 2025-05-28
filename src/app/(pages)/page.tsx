"use client";

import React from "react";

interface MenuLink {
  id: string;
  href: string;
  label: string;
}

export default function Home() {
  const gridColsClass = "md:grid md:grid-cols-3";

  const menuLinks: MenuLink[] = [
    {
      id: "gezinnenLink",
      href: "/familys",
      label: "Gezinnen",
    },
    {
      id: "voorraadLink",
      href: "/foodproducts",
      label: "Voorraad",
    },
    {
      id: "vrijwilligersLink",
      href: "/volunteers",
      label: "Vrijwilligers",
    },
  ];

  const renderButton = (link: MenuLink) => {
    return (
      <a
        key={link.id}
        id={link.id}
        href={link.href}
        className="bg-custom-blue border-black/10 border-2 text-white rounded-md text-xl flex items-center justify-center w-[60vw] md:w-52 h-[96px]"
      >
        {link.label}
      </a>
    );
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center py-60 gap-16 font-[family-name:var(--font-geist-sans)]">
      <main id="Home" className="flex flex-col gap-[32px] row-start-2 items-center">
        <div className="text-center">
          <p className="text-4xl font-bold">
            Welkom bij de Sint-Vincentius App!
          </p>
        </div>
        <div className="text-center">
          <p className="text-4xl font-bold mb-5">Wat wil je beheren?</p>
          <div className={`flex flex-col ${gridColsClass} gap-6 w-full max-w-2xl items-center`}>
            {menuLinks.map((link) => renderButton(link))}
          </div>
        </div>
      </main>
    </div>
  );
}
