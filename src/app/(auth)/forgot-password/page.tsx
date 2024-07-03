"use client";
import { useToast } from "@/components/ui/use-toast";
import { APIResponse } from "@/types/APIResponse";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const identifierSchema = z.object({
  identifier: z.string(),
});

function ForgotPasswordPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof identifierSchema>>({
    resolver: zodResolver(identifierSchema),
  });

  const handleResetPassword = async (data: z.infer<typeof identifierSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/forgot-password/send-otp", {
        identifier: data.identifier,
      });
      toast({
        title: "OTP Sent Successfully",
        description: "Please Enter the OTP sent to your email",
      });
      const username = response.data.data.username;
      router.replace(`/forgot-password/${username}`);
    } catch (error) {
      const axiosError = error as AxiosError<APIResponse>;
      const errMessage =
        axiosError.response?.data?.message ??
        "There was a problem with Sending OTP. Please try again. ☹️";
      toast({
        title: "OTP Sending Failed",
        description: errMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-lg shadow-md">
        {/* Headers */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight mb-6">Forgot Password</h1>
          <h1 className="text-lg tracking-tight">
            Enter your username or email to reset your password.
          </h1>
        </div>
        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleResetPassword)} className="space-y-8">
            {/* Username */}
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username or Email</FormLabel>
                  {/* Input field */}
                  <FormControl>
                    <Input {...field} placeholder="Please enter your username or email" />
                  </FormControl>
                  {/* Unique username check response */}
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Submit button */}
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                "Reset My Account Password"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
