"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signUpSchema } from "@/schemas/signUpSchema";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { APIResponse } from "@/types/APIResponse";
import { useRouter } from "next/navigation";

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
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import googleSvg from "../../../../public/google.svg";
import githubSvg from "../../../../public/github.svg";
import twitterSvg from "../../../../public/twitter.svg";
import { signIn } from "next-auth/react";
import { Pacifico } from "next/font/google";

const pacifico = Pacifico({ subsets: ["latin"], weight: "400", variable: "--font-pacifico" });

function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [isUsernameChecking, setIsUsernameChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [debouncedUsername, setDebouncedUsername] = useDebounceValue(username, 500);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      setIsUsernameChecking(true);
      setUsernameMessage("");
      try {
        const response = await axios.get(`/api/check-username-unique?username=${username}`);
        setUsernameMessage(response.data.message);
        setIsUsernameAvailable(response.data.data.isAvailable);
      } catch (error) {
        const axiosError = error as AxiosError<APIResponse>;
        console.error(error);
        setUsernameMessage(axiosError.response?.data?.message ?? "Error checking username");
        setIsUsernameAvailable(axiosError.response?.data?.data.isAvailable);
      } finally {
        setIsUsernameChecking(false);
      }
    };
    if (username) checkUsernameUnique();
    else setUsernameMessage("");
  }, [debouncedUsername]);

  const handleSignUp = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/sign-up", data);
      toast({
        title: "Sign Up Success",
        description: "Account Created Successfully 🥳",
      });
      router.replace(`/verify/${username}`);
    } catch (error) {
      console.error(error);
      const axiosError = error as AxiosError<APIResponse>;
      const errMessage =
        axiosError.response?.data?.message ??
        "There was a problem with your sign-up. Please try again. ☹️";
      toast({
        title: "Sign Up Failed",
        description: errMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const [errorMessage, setErrorMessage] = useState("");

  const handleSignInWithProvider = async (provider: any) => {
    const result = await signIn(provider, { redirect: false });
    console.log("result on sign in :", result);
    if (result) {
      setErrorMessage("User already exists with this email.");
    } else setErrorMessage("");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-black to-gray-700">
      <div className="w-full max-w-xl p-8 pt-10 space-y-6 bg-white rounded-lg shadow-md">
        {/* Headers */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tighter lg:text-5xl mb-4">
            Join
            <Link
              href={"/"}
              className={`${pacifico.className} text-4xl lg:text-[2.6rem] tracking-normal font-bold ml-2`}
            >
              Secret Alley
            </Link>
          </h1>
          <p>Sign up to start your anonymous adventure</p>
        </div>
        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-6 px-6">
            {/* Username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  {/* Input field */}
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setUsername(e.target.value);
                      }}
                      placeholder="Choose your username"
                    />
                  </FormControl>
                  {/* Unique username check response */}
                  <FormDescription>
                    {isUsernameChecking ? (
                      <Loader2 className=" animate-spin" />
                    ) : (
                      username &&
                      usernameMessage && (
                        <p
                          className={`text-sm ${
                            usernameMessage === "Username is available"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {usernameMessage}
                        </p>
                      )
                    )}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-password"
                  onClick={() => {
                    setShowPassword((pre) => !pre);
                  }}
                />
                <Label htmlFor="show-password" className=" cursor-pointer">
                  Show Password{" "}
                </Label>
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isSubmitting || !isUsernameAvailable}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
        {/* OR */}
        <div className="flex items-center">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="px-3 text-black font-bold dark:text-gray-200">OR</span>
          {errorMessage}
          <hr className="flex-grow border-t border-gray-300" />
        </div>
        {/* Providers */}
        <div className="flex flex-col space-y-2 px-6">
          {/* Google */}
          <Button
            onClick={() => signIn("google")}
            className="py-2 px-4 flex justify-center items-center bg-black hover:bg-gray-700 focus:ring-gray-500 focus:ring-offset-gray-200 text-white w-full transition ease-in duration-200 text-center text-base shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
          >
            <Image src={googleSvg} alt="google" className="size-7 mr-3"></Image>
            Sign Up with Google
          </Button>
          {/* GitHub */}
          <Button
            onClick={() => handleSignInWithProvider("github")}
            className="py-2 px-4 flex justify-center items-center bg-black hover:bg-gray-700 focus:ring-gray-500 focus:ring-offset-gray-200 text-white w-full transition ease-in duration-200 text-center text-base shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
          >
            <Image src={githubSvg} alt="google" className="mr-3"></Image>
            Sign Up with Github
          </Button>
          {/* Twitter */}
          {/* <Button
            onClick={() => signIn("twitter")}
            className="py-2 px-4 flex justify-center items-center bg-black hover:bg-gray-700 focus:ring-gray-500 focus:ring-offset-gray-200 text-white w-full transition ease-in duration-200 text-center text-base shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
          >
            <Image src={twitterSvg} alt="google" className="mr-3"></Image>
            &nbsp; Sign in with Twitter
          </Button> */}
        </div>
        {/* Sign In */}
        <div className="text-center mt-4">
          <p>
            Already a member?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
