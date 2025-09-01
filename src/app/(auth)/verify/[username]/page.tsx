'use client'
import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { verifySchema } from '@/schemas/verifySchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

function VerifyAccount() {
    const router = useRouter()
    const params = useParams()

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code
            })
            toast.success(response.data.message)
            router.replace('/sign-in')
        } catch (error) {
            toast.error("Failed to verify account")
            console.error("Error in verifying user ", error)
            const axiosError = error as AxiosError<ApiResponse>
            let errorMessage = axiosError.response?.data.message
            toast.error(errorMessage);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
            <div className="w-full max-w-md p-8 bg-gray-900 rounded-2xl shadow-lg">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold">Verify Your Account</h1>
                    <p className="text-gray-400 mt-2">Enter the verification code sent to your email</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            name='code'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-300">Verification Code</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your verification code"
                                            {...field}
                                            className="w-full p-3 border rounded-lg bg-gray-800 border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-400"/>
                                </FormItem>
                            )}
                        />
                        <Button
                            type='submit'
                            className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                        >
                            Submit
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default VerifyAccount
