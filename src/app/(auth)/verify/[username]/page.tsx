"use client";
import { useToast } from "@/components/ui/use-toast";
import { APIResponse } from "@/types/APIResponse";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { z } from "zod";
import { verifySchema } from "@/schemas/verifySchema";
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

function VerifyCodePage() {
  const { username } = useParams();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const handleVerifyCode = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/verify-code", { username, code: data.verifyCode });
      toast({
        title: "Verification Success",
        description: "Account Verified Successfully 🥳",
      });
      router.replace("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<APIResponse>;
      const errMessage =
        axiosError.response?.data?.message ??
        "There was a problem with your verification. Please try again. ☹️";
      toast({
        title: "OTP Verification Failed",
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
          <h1 className="text-4xl font-extrabold tracking-tight mb-6">Verify Your Account</h1>
          <h1 className="text-lg tracking-tight">OTP will be expire in 10 minutes</h1>
        </div>
        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleVerifyCode)} className="space-y-8">
            {/* Username */}
            <FormField
              control={form.control}
              name="verifyCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  {/* Input field */}
                  <FormControl>
                    <Input {...field} />
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
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default VerifyCodePage;
