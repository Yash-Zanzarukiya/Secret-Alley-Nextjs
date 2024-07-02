"use client";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { messageSchema } from "@/schemas/messageSchema";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import axios, { AxiosError } from "axios";
import { APIResponse } from "@/types/APIResponse";
import { useCompletion } from "ai/react";
import SuggestMessageLoading from "@/components/LoadingComponents/SuggestMessageLoading";
let count = 0;
function ProfilePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { username } = useParams();

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const { setValue, reset, watch, clearErrors } = form;

  const inputMessage = watch("content");

  console.log("count: ", count++);

  const handleSendMessage = async (data: z.infer<typeof messageSchema>) => {
    setIsSubmitting(true);
    try {
      const res = await axios.post("/api/send-message", { username, content: data.content });
      console.log("res: ", res);
      toast({
        title: "Message sent successfully 🙂",
      });
      reset({ content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<APIResponse>;
      const errMessage =
        axiosError.response?.data?.message ?? "Failed to fetch Suggestion messages ☹️";
      toast({
        title: "Oops!!!",
        description: errMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const initialCompletion =
    "What's your favorite movie?||Do you have any pets?||What's your dream job?";

  const {
    completion,
    complete,
    error,
    isLoading: isSuggestLoading,
  } = useCompletion({
    api: "/api/suggest-messages",
    initialCompletion,
  });

  const fetchSuggestedMessages = async () => {
    try {
      complete("");
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Oops!!!",
        description: "Failed to fetch Suggestion messages ☹️",
        variant: "destructive",
      });
    }
  };

  return (
    <div className=" w-full min-h-screen">
      <div className="mb-8 mx-4 md:mx-8 lg:mx-auto p-6 rounded w-full max-w-4xl">
        <h1 className="text-4xl text-center font-bold mb-7 mt-6">Public Profile Link</h1>
        <div className="mb-12">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSendMessage)} className="w-full space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <p>Send Anonymous Message to @{username}</p>
                    <FormControl>
                      <Textarea
                        placeholder="Write your anonymous message here"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className=" flex justify-center">
                <Button type="submit" disabled={isSubmitting || !inputMessage}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Sending
                    </>
                  ) : (
                    "Send it"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        <div>
          <Button disabled={isSuggestLoading} onClick={fetchSuggestedMessages}>
            Suggest Messages (AI)
          </Button>
          <p className=" py-5">Click on any message below to select it.</p>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Suggested Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                {error && error.message}
                {completion.split("||")[0] &&
                  completion.split("||").map((msg: string) => (
                    <div key={msg} className="flex flex-col space-y-1.5">
                      <Button onClick={(e) => setValue("content", msg)} variant="outline">
                        {msg}
                      </Button>
                    </div>
                  ))}
                {/* Loading Animations */}
                {completion.split("||").length < 3 && (
                  <>
                    <SuggestMessageLoading />
                    {completion.split("||").length < 2 && (
                      <>
                        <SuggestMessageLoading />
                        {!completion.split("||")[0] && <SuggestMessageLoading />}
                      </>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <Separator className="my-9" />
        <div>
          <div className=" flex flex-col items-center space-y-3 justify-center">
            <p>Get Your Message Board</p>
            <Link href={"/sign-up"}>
              <Button type="button">Create Your Account</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
