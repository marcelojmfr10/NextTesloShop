"use client";

import Link from "next/link";
import { IoSearchOutline, IoCartOutline } from "react-icons/io5";
import { titleFont } from "@/app/config/fonts";
import { useCartStore, useUIStore } from "@/app/store";
import { useEffect, useState } from "react";

export const TopMenu = () => {
  const openMenu = useUIStore((state) => state.openSideMenu);
  const totalItems = useCartStore((state) => state.getTotalItems());

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <nav className="flex px-5 justify-between items-center w-full">
      {/* logo */}
      <div>
        <Link href="/">
          <span className={`${titleFont.className} antialised font-bold`}>
            Teslo
          </span>
          <span> | Shop</span>
        </Link>
      </div>

      {/* center menu */}
      <div className="hidden sm:block">
        <Link
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          href="/gender/men"
        >
          Hombres
        </Link>
        <Link
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          href="/gender/women"
        >
          Mujeres
        </Link>
        <Link
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          href="/gender/kid"
        >
          Niños
        </Link>
      </div>

      {/* search, cart, menu */}
      <div className="flex items-center">
        <Link href="/search" className="mx-2">
          <IoSearchOutline className="w-5 h-5" />
        </Link>
        <Link
          href={totalItems === 0 && loaded ? "/empty" : "/cart"}
          className="mx-2"
        >
          <div className="relative">
            {loaded && totalItems > 0 && (
              <span className="fade-in absolute text-xs px-1 rounded-full font-bold -top-2 -right-2 bg-blue-700 text-white">
                {totalItems}
              </span>
            )}

            <IoCartOutline className="w-5 h-5" />
          </div>
        </Link>

        <button
          onClick={openMenu}
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
        >
          Menú
        </button>
      </div>
    </nav>
  );
};
