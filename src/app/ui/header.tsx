"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";

const HeaderSV: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleHome = () => {
    router.push("/");
  };

  const handleBackClick = () => {
    router.back();
  };

  const leftButtons = (
    <button
      onClick={handleBackClick}
      className="text-black rounded-lg"
      aria-label="Terug naar vorige pagina"
    >
      <div className="flex items-center">
        <ArrowLeft
          size={100}
          className="p-6 hover:text-custom-blue transition all hover:scale-105"
        />
      </div>
    </button>
  );

  return pathname === "/" ? (
    <header>
      <div className="grid grid-cols-4 items-center text-center relative bg-white h-[100px]">
        <Image
          src="/logo-sint-vincentius.png"
          width={100}
          height={100}
          alt="Sint-Vincentius logo"
          className="md:block ml-2 p-2"
        />
        <p className="text-4xl col-span-2 font-semibold">Sint-Vincentius</p>
        <div className="w-44 ml-auto m-5">&nbsp;</div>
      </div>
      <hr />
    </header>
  ) : (
    <header>
      <div className="flex items-center bg-white h-[100px]">
        <div className="flex-1">{leftButtons}</div>
        <div className="flex-1 text-center">
          <p className="text-4xl font-semibold">Sint-Vincentius</p>
        </div>
        <div className="flex-1">
          <Home
            onClick={handleHome}
            className="block ml-auto p-6 hover:text-custom-blue hover:scale-105 transition-all"
            size={100}
          />
        </div>
      </div>
      <hr />
    </header>
  );
};

export default HeaderSV;
