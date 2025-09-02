"use client"

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";

function Navbar() {
    const { data: session } = useSession();
    const user: User = session?.user as User;
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-gradient-to-r from-black via-blue-950 to-black shadow-md sticky top-0 z-50">
            <div className="w-full py-2 sm:p-2 md:px-12 lg:px-28 mx-auto px-6 flex justify-between items-center">

                {/* Logo / Brand */}
                <Link
                    href="/"
                    className="text-xl sm:text-2xl font-bold text-white tracking-wide hover:opacity-90 transition flex items-center gap-2"
                >
                    <img
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                        src="Logo.png"
                        alt="Logo"
                    />
                    Mystery Message
                </Link>

                {/* Desktop Links + Auth */}
                <div className="hidden md:flex items-center gap-4">
                    {session ? (
                        <>
                            <span className="text-white font-medium">
                                Welcome! {user?.username?.toLocaleUpperCase() || user?.email}
                            </span>
                            <Button
                                onClick={() => signOut()}
                                className="bg-white text-purple-600 hover:bg-gray-100 transition cursor-pointer"
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Link href="/sign-in">
                            <Button className="bg-white text-purple-600 hover:bg-gray-100 transition cursor-pointer">
                                Login
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden flex flex-col items-center gap-4 pb-4 bg-black/90 border-t border-gray-700">
                    {session ? (
                        <>
                            <span className="text-white font-medium mt-2">
                                Welcome! {user?.username?.toLocaleUpperCase() || user?.email}
                            </span>
                            <Button
                                onClick={() => {
                                    signOut();
                                    setIsOpen(false);
                                }}
                                className="bg-white text-purple-600 hover:bg-gray-100 transition cursor-pointer w-28"
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                            <Button className="bg-white text-purple-600 hover:bg-gray-100 transition cursor-pointer w-28">
                                Login
                            </Button>
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
}

export default Navbar;
