"use client";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import * as z from "zod"
import Link from "next/link";
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

function Page() {

    const router = useRouter();

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: ''
        }
    })


    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        const result = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password
        })

        if (result?.error) {
            toast.error("Failed to sign in please try again!")
        }

        if (result?.url) {
            toast.success("Login successfully!")
            router.replace('/dashboard')
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
                        Sign In to start your anonymous adventure.
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-300">Email/Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter email / username"
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
                            className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium cursor-pointer transition"
                        >
                            Sign In
                        </Button>
                    </form>

                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-400">
                            Don&apos;t have an account?{" "}
                            <Link href="/sign-up" className="text-indigo-400 hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default Page
