"use client"

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";

function Navbar() {
    const { data: session } = useSession();
    const user: User = session?.user as User;

    return (
        <nav className="bg-gradient-to-r from-black via-blue-950 to-black shadow-md sticky top-0 z-50 border rounded">
            <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

                {/* Logo / Brand */}
                <Link href="/" className="text-2xl font-bold text-white tracking-wide hover:opacity-90 transition">
                    Mystery Message
                </Link>

                {/* Links + Auth */}
                <div className="flex items-center gap-4">
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
            </div>
        </nav>
    );
}

export default Navbar;
