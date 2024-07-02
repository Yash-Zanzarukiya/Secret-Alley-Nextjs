"use client";
import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/model/User";
import { useSession } from "next-auth/react";
import { APIResponse } from "@/types/APIResponse";
import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { acceptMessagesSchema } from "@/schemas/acceptMessageSchema";
import MessageCard from "@/components/MessageCard";
import { Loader2, RefreshCcw } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import ChangeUsername from "@/components/ChangeUsername";

function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages((pre) => pre.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessagesSchema),
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const res = await axios.get("/api/accepting-status");
      setValue("acceptMessages", res.data.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<APIResponse>;
      const errMessage =
        axiosError.response?.data?.message ?? "Failed to fetch message accepting status ☹️";
      toast({
        title: "Error",
        description: errMessage,
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const res = await axios.get<APIResponse>("/api/get-messages");
        console.log("res.data: ", res.data);
        setMessages(res.data.data || []);
        if (refresh) {
          toast({
            title: "Refreshed Messages",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<APIResponse>;
        const errMessage = axiosError.response?.data?.message ?? "Failed to fetch messages ☹️";
        toast({
          title: "Error",
          description: errMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setMessages, setIsLoading]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchAcceptMessages();
    fetchMessages();
  }, [session, setValue, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const res = await axios.patch<APIResponse>("/api/accepting-status", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: res.data.message,
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<APIResponse>;
      const errMessage = axiosError.response?.data?.message ?? "Failed to switch status ☹️";
      toast({
        title: "Error",
        description: errMessage,
        variant: "destructive",
      });
    }
  };

  if (!session || !session.user)
    return (
      <div className="flex items-center justify-center w-full mt-80">
        <h1 className="text-center">Please Wait...</h1>
      </div>
    );

  const baseURL = `${window.location.protocol}//${window.location.host}`;

  const profileURL = `${baseURL}/users/${session.user.username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileURL);
    toast({
      title: "URL Copied",
      description: "Profile URL has been copied to clipboard",
    });
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileURL}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      {/* Message Accepting and change username */}
      <div className="flex items-center justify-between mb-4 mt-4 ">
        <div className="flex items-center">
          <Switch
            {...register("acceptMessages")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span className="ml-2 text-lg">Accept Messages: {acceptMessages ? "On" : "Off"}</span>
        </div>
        {/* <ChangeUsername username={session.user.username} /> */}
      </div>

      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message: any, index) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
