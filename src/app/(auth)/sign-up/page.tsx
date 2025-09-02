"use client";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import * as z from "zod"
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from 'lucide-react';

function Page() {
    const [username, setUsername] = useState("")
    const [usernameMessage, setUsernameMessage] = useState("")
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const debounced = useDebounceCallback(setUsername, 300);
    const router = useRouter();

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    })

    useEffect(() => {
        const checkUsernameUniqueness = async () => {
            if (username) {
                setIsCheckingUsername(true)
                setUsernameMessage('')
                try {
                    const response = await axios.get(`/api/check-username-unique?username=${username}`)
                    setUsernameMessage(response.data.message)
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>
                    setUsernameMessage(axiosError.response?.data.message ?? "Error in checking username")
                } finally {
                    setIsCheckingUsername(false)
                }
            }
        }

        checkUsernameUniqueness();
    }, [username])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post<ApiResponse>('/api/sign-up', data)
            toast.success(response.data.message)

            router.replace(`/verify/${username}`)
            setIsSubmitting(false)
        } catch (error) {
            console.error("Error in signup of user ", error)
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage = axiosError.response?.data.message
            toast.error(errorMessage);
            setIsSubmitting(false)
        }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center relative"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1508780709619-79562169bc64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80')",
            }}
        >
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black/70" />

            {/* Form container */}
            <div className="relative z-10 bg-black p-8 rounded-2xl shadow-xl w-full max-w-md text-white">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold">Join Mystery Message</h1>
                    <p className="text-gray-400 mt-2">
                        Sign up to start your anonymous adventure
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-300">Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter username"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e)
                                                debounced(e.target.value)
                                            }}
                                            className="w-full p-3 border rounded-lg bg-gray-900 border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </FormControl>
                                    {isCheckingUsername && <Loader className="animate-spin h-4 w-4 text-indigo-400" />}
                                    <p
                                        className={`text-sm mt-1 ${usernameMessage === "This username is available"
                                            ? "text-green-400"
                                            : "text-red-400"
                                            }`}
                                    >
                                        {usernameMessage}
                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-300">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter email"
                                            {...field}
                                            className="w-full p-3 border rounded-lg bg-gray-900 border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-300">Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Enter password"
                                            {...field}
                                            className="w-full p-3 border rounded-lg bg-gray-900 border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader className="mr-2 h-4 w-4 animate-spin" /> Please Wait!
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </Button>
                    </form>

                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-400">
                            Already a member?{" "}
                            <Link href="/sign-in" className="text-indigo-400 hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default Page
