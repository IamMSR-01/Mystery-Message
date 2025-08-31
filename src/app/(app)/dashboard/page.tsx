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

function page() {

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  }

  const { data: session } = useSession();

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

      if (refresh) {
        toast.success("Showing latest messages");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Failed to fetch message settings");
    } finally {
      setIsLoading(false)
      setIsSwitchLoading(false);
    }
  }, [setIsLoading, setMessages])

  useEffect(() => {

    if (!session || !session.user) return;

    fetchMessages();
    fetchAcceptMessage();

  }, [session, setValue, fetchAcceptMessage, fetchMessages])


  // handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages
      })

      setValue('acceptMessages', !acceptMessages)

      toast.success(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Failed to fetch message settings");
    }
  }

  const { username } = session?.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;

  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast.success("Profile URL has been copied to clipboard");
  }

  if (!session || !session.user) {
    return <div>Please Login</div>
  }

  return (
    <div>
      <h1>User Dashboard</h1>
      <div>
        <h2>Copy your unique link</h2>{' '}
        <div>
          <input 
            type="text"
            value={profileUrl}
            disabled 
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div>
          <Switch
            {...register('acceptMessages')}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span>
            Accept Messages: { acceptMessages? "On" : "Off"}
          </span>
      </div>
      <Separator />

      <Button
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {
          isLoading ? (
            <Loader2 />
          ) : (
            <RefreshCcw />
          )
        }
      </Button>

      <div>
        {
          messages.length > 0 ? (
            messages.map((message, index) => (
              <MessageCard 
                key={String(message._id)}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <p>No messages to display</p>
          )
        }
      </div>

    </div>
  )
}

export default page