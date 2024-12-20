"use client"
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="flex items-center justify-between font-customSemi w-full p-4 bg-white shadow-md">
      {/* Logo */}
      <div className="logo">
        <Image src="/logo.png" width={120} height={98} alt="logo" />
      </div>

      {/* Hamburger Icon */}
      <div className="sm:hidden" onClick={toggleMenu}>
        <button aria-label="Toggle Menu">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-8 h-8 text-gray-700"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      {/* Navigation Links */}
      <ul
        className={`flex-col absolute sm:static sm:flex sm:flex-row items-center sm:visible gap-[29px] text-lg bg-white sm:bg-transparent shadow-lg sm:shadow-none p-6 sm:p-0 top-20 right-5 sm:top-0 sm:right-0 rounded-lg ${
          isOpen ? 'flex' : 'hidden'
        }`}
      >
        <li className="mb-4 sm:mb-0">
          <Link href="/">Home</Link>
        </li>
        <li className="mb-4 sm:mb-0">
          <Link href="/about">About</Link>
        </li>
        <li className="mb-4 sm:mb-0">
          <Link href="/services">Services</Link>
        </li>
        <li className="mb-4 sm:mb-0">
          <Link href="/portfolio">Portfolio</Link>
        </li>
        <li className="mb-4 sm:mb-0">
          <Link href="/contact">Contact</Link>
        </li>
      </ul>

      {/* Call to Action */}
      <div className="hidden sm:flex items-center">
        <button className="bg-secondary-dark text-white px-[16px] py-[10px] rounded-3xl">
          Get Started
        </button>
      </div>
    </nav>
  );
}
