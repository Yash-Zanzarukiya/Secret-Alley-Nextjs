"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import axios, { AxiosError } from "axios";
import { APIResponse } from "@/types/APIResponse";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must have at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must have at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

function ResetPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { username } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleSignIn = async (data: z.infer<typeof resetPasswordSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/forgot-password/reset-password", {
        password: data.password,
        username,
      });
      toast({
        title: "Password Reset",
        description: "Your password has been reset successfully",
      });
      router.replace("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<APIResponse>;
      const errMessage =
        axiosError.response?.data?.message ??
        "There was a problem while resetting your password. Please try again.";
      toast({
        title: "Error ☹️",
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
          <h1 className="text-2xl font-extrabold tracking-tight lg:text-4xl mb-6">
            Reset Your Password
          </h1>
          <p className="mb-4">Create a new password for your account</p>
        </div>
        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSignIn)} className="space-y-6">
            {/* identifier */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Choose your new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center  space-x-2">
              <Checkbox
                id="show-password"
                onClick={() => {
                  setShowPassword((pre) => !pre);
                }}
              />
              <Label htmlFor="show-password">Show Password </Label>
            </div>
            {/* Submit button */}
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting Password
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default ResetPage;
