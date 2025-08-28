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

function verifyAccount() {

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
        <div>
            <div>
                <div>
                    <h1>Verify Your Account</h1>
                    <p>Enter the verification code sent to your email</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} >
                        <FormField
                            name='code'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your verification code" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type='submit'>
                            Submit
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default verifyAccount