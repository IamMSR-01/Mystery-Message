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
            <main className="min-h-screen bg-black text-white flex flex-col items-center p-6 pt-20">
                <section className="text-center mb-8">
                    <h1 className="text-3xl md:text-5xl font-bold mb-2">Dive into the world of Anonymous Conversation!</h1>
                    <p className="text-gray-300 text-lg md:text-xl mt-10">
                        Explore Mystery Message - Where your identity remains a secret.
                    </p>
                </section>

                <Carousel
                    plugins={[Autoplay({ delay: 2000 })]}
                    className="w-full max-w-lg mt-10">
                    <CarouselContent>
                        {
                            messages.map((message, index) => (
                                <CarouselItem key={index}>
                                    <div className="p-2">
                                        <Card className="bg-gray-900 border border-gray-700 shadow-lg rounded-xl">
                                            <CardHeader className="text-xl font-semibold text-indigo-400">
                                                {message.title}
                                            </CardHeader>
                                            <CardContent className="flex items-center justify-center p-6 text-center">
                                                <span className="text-lg md:text-2xl text-white">{message.content}</span>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))
                        }
                    </CarouselContent>
                </Carousel>
            </main>
            <footer className="w-full bg-gray-900 text-gray-400 py-4 flex flex-col md:flex-row items-center justify-between px-20 border-t border-gray-700">
                <p className="text-sm">&copy; {new Date().getFullYear()} Mystery Message. All rights reserved.</p>
                <div className="flex space-x-4 mt-2 md:mt-0">
                    <a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-indigo-400 transition-colors">Contact</a>
                </div>
            </footer>
        </>
    )
}

export default page
