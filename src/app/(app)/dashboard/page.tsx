"use client"
import MessageCard from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Message } from '@/models/User'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  }

  const { data: session, status } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages")
      setValue('acceptMessages', response.data.isAcceptingMessages ?? false)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Failed to fetch message settings");
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    setIsSwitchLoading(false);
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages')
      setMessages(response.data.messages || [])
      if (refresh) toast.success("Showing latest messages");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Failed to fetch message settings");
    } finally {
      setIsLoading(false)
      setIsSwitchLoading(false);
    }
  }, [])

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session, setValue, fetchAcceptMessage, fetchMessages])

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages
      })
      setValue('acceptMessages', !acceptMessages)
      toast.success(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Failed to update settings");
    }
  }

  if (status === "loading") {
    return <div className="text-center text-white mt-20"><Loader2 className="animate-spin" /></div>;
  }

  if (status === "unauthenticated" || !session || !session.user) {
    return <div className="text-center text-white mt-20">Please Login</div>
  }

  const { username } = session?.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast.success("Profile URL has been copied to clipboard");
  }

  return (
    <div className="min-h-screen w-full p-6 px-28 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mt-6 mb-6">User Dashboard</h1>

      {/* Profile Link */}
      <div className="mb-6 p-4 bg-black/40 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold mb-1">Copy your unique link</h2>
          <input
            type="text"
            value={profileUrl}
            disabled
            className="w-full sm:w-auto p-2 rounded-lg bg-gray-700 border border-gray-600 text-white px-3"
          />
        </div>
        <Button onClick={copyToClipboard} className="mt-2 sm:mt-0 sm:ml-4 bg-blue-700 cursor-pointer hover:bg-blue-500">Copy</Button>
      </div>

      {/* Accept Messages Switch */}
      <div className="mb-6 flex items-center gap-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
          className='bg-blue-700 data-[state=unchecked]:bg-red-600 data-[state=checked]:bg-green-600'
        />
        <span>Accept Messages: <strong>{acceptMessages ? "On" : "Off"}</strong></span>
      </div>
      <Separator />

      {/* Refresh Messages */}
      <div className="my-4">
        <Button
          variant="outline"
          onClick={(e) => { e.preventDefault(); fetchMessages(true); }}
        >
          {isLoading ? <Loader2 className="animate-spin w-4 h-4 text-black" /> : <RefreshCcw className='text-black w-4 h-4' />}
        </Button>
      </div>

      {/* Messages */}
      <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={String(message._id)}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p className="text-gray-400">No messages to display</p>
        )}
      </div>
    </div>
  )
}

export default Page
