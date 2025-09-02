"use client"

import { messageSchema } from '@/schemas/messageSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { ApiResponse } from '@/types/ApiResponse';
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useCompletion } from '@ai-sdk/react'
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

const initialMessages = [
    "What's your favorite movie?",
    "If you could have any superpower, what would it be?",
    "What's the best piece of advice you've ever received?",
]

function Page() {
    const params = useParams<{ username: string }>();
    const username = params.username;

    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<string[]>(initialMessages);

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: ''
        }
    })

    const { complete, isLoading: isSuggesting } = useCompletion({
        api: '/api/suggest-messages',
        onFinish: (_prompt, completion) => {
            const newMessages = completion.split('||').map(msg => msg.trim()).filter(Boolean);
            setMessages(newMessages);
            toast.success('Suggested messages updated!');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to fetch suggested messages.');
            console.log("Error from useCompletion:", error);
        }
    })

    const fetchSuggestedMessages = async () => {
        complete("")
    }

    const handleMessageClick = async (message: string) => {
        form.setValue('content', message);
    }

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        setIsLoading(true);
        try {
            const response = await axios.post<ApiResponse>('/api/send-message', {
                username,
                content: data.content
            })
            if (!response.data.success) {
                toast.error('Failed to send message. Please try again later.');
            }

            toast.success(response.data.message || 'Message sent successfully!');
            form.reset({ content: '' });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message || 'Failed to send message.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="container mx-auto my-8 p-6 max-w-3xl bg-black">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-white">
                Public Message Board
            </h1>

            <p className="text-center mb-4 text-gray-300 text-sm md:text-base">
                Send an anonymous message to <span className="font-semibold text-indigo-400">@{username}</span>
            </p>

            {/* Main Message Form */}
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6 bg-gray-900 p-6 rounded-xl shadow-md border border-gray-700"
                >
                    <FormField
                        name="content"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea
                                        placeholder="Write your anonymous message here..."
                                        className="resize-none bg-gray-800 text-white border-gray-600 focus:ring-2 focus:ring-indigo-500"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-500 text-sm mt-1" />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-center">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Send Message'}
                        </Button>
                    </div>
                </form>
            </Form>

            <Separator className="my-8 bg-gray-700" />

            {/* Suggest Messages Section */}
            <div className="text-center">
                <Button
                    onClick={fetchSuggestedMessages}
                    disabled={isSuggesting}
                    className="bg-gray-800 hover:bg-gray-700 text-white"
                >
                    {isSuggesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Suggest New Messages'}
                </Button>

                <Card className="mt-6 bg-gray-900 text-white border border-gray-700">
                    <CardHeader>
                        <p className="text-sm md:text-base text-gray-300">
                            Click on any message below to use it.
                        </p>
                    </CardHeader>
                    <CardContent className="flex flex-col space-y-4">
                        {messages.map((message, index) => (
                            <Button
                                key={index}
                                variant="outline"
                                className="w-full text-left py-6 whitespace-normal break-words bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700"
                                onClick={() => handleMessageClick(message)}
                            >
                                {message}
                            </Button>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default Page
