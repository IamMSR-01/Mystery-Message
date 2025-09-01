"use client"
import React from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem
} from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay'
import messages from "@/messages.json"

function page() {
    return (
        <>
            <main className="min-h-screen bg-black text-white flex flex-col items-center p-4 sm:p-6 pt-16 sm:pt-20">
                {/* Hero Section */}
                <section className="text-center max-w-4xl mb-8 px-2">
                    <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-snug mb-4">
                        Dive into the world of Anonymous Conversation!
                    </h1>
                    <p className="text-gray-300 text-base sm:text-lg md:text-xl mt-4 sm:mt-6">
                        Explore Mystery Message - Where your identity remains a secret.
                    </p>
                </section>

                {/* Carousel Section */}
                <Carousel
                    plugins={[Autoplay({ delay: 2500 })]}
                    className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl mt-10"
                >
                    <CarouselContent>
                        {messages.map((message, index) => (
                            <CarouselItem key={index}>
                                <div className="p-2 sm:p-4">
                                    <Card className="bg-gray-900 border border-gray-700 shadow-xl rounded-2xl hover:shadow-indigo-500/20 transition-shadow duration-300">
                                        <CardHeader className="text-lg sm:text-xl md:text-2xl font-semibold text-indigo-400 text-center">
                                            {message.title}
                                        </CardHeader>
                                        <CardContent className="flex items-center justify-center p-4 sm:p-6 text-center">
                                            <span className="text-base sm:text-lg md:text-xl lg:text-2xl text-white leading-relaxed">
                                                {message.content}
                                            </span>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </main>

            {/* Footer Section */}
            <footer className="w-full bg-gray-900 text-gray-400 py-6 flex flex-col md:flex-row items-center justify-between px-6 sm:px-12 lg:px-20 border-t border-gray-700 mt-12">
                <p className="text-xs sm:text-sm text-center md:text-left">
                    &copy; {new Date().getFullYear()} Mystery Message. All rights reserved.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 mt-3 md:mt-0">
                    <a href="#" className="hover:text-indigo-400 transition-colors text-sm">Privacy Policy</a>
                    <a href="#" className="hover:text-indigo-400 transition-colors text-sm">Terms of Service</a>
                    <a href="#" className="hover:text-indigo-400 transition-colors text-sm">Contact</a>
                </div>
            </footer>
        </>
    )
}

export default page
