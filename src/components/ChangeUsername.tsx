"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import { APIResponse } from "@/types/APIResponse";
import { use, useEffect, useState } from "react";
import { useToast } from "./ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";
import { useDebounceValue } from "usehooks-ts";
import { Loader2 } from "lucide-react";

const usernameSchema = z.object({ username: usernameValidation });

function ChangeUsername({ username }: { username: string }) {
  const [isUnique, setIsUnique] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [inputUsername, setInputUsername] = useState(username);
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  const { toast } = useToast();
  const [debouncedUsername, setDebouncedUsername] = useDebounceValue(inputUsername, 500);

  const checkUniqueUsername = async () => {
    setIsChecking(true);
    setMessage("");
    try {
      const response = await axios.get(`/api/check-username-unique?username=${inputUsername}`);
      setMessage(response.data.message);
      setIsUnique(response.data.data.isAvailable);
    } catch (error) {
      const axiosError = error as AxiosError<APIResponse>;
      let errMessage = axiosError.response?.data?.message ?? "Error checking username ☹️";
      if (inputUsername.length > 0) errMessage = "username must be of at-least 2 characters";
      setMessage(errMessage);
      setIsUnique(axiosError.response?.data?.data.isAvailable);
    } finally {
      setIsChecking(false);
    }
  };

  async function updateUsername() {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/update-profile", { username: inputUsername });
      toast({
        title: "Success",
        description: response.data.message,
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
      const axiosError = error as AxiosError<APIResponse>;
      toast({
        title: "Error Updating Username",
        description:
          axiosError.response?.data?.message ?? "Something went wrong updating your username.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (inputUsername && inputUsername !== username) checkUniqueUsername();
    else setMessage("");
  }, [debouncedUsername]);

  return (
    isDialogOpen && (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default">Change Username</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className=" text-xl font-bold tracking-tight">Change Username</DialogTitle>
            <DialogDescription>Make changes to your username here.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2 mt-3">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right text-md">
                Username
              </Label>
              <Input
                name="username"
                onChange={(e) => setInputUsername(e.target.value)}
                value={inputUsername}
                className="col-span-3"
              />
            </div>
          </div>
          {isChecking ? (
            <Loader2 className="w-5 h-5 ml-2" />
          ) : (
            <span className={`${isUnique ? " text-green-500 " : " text-red-500"} ml-7 text-sm`}>
              {message || <span className="text-black">Choose some username</span>}
            </span>
          )}
          <DialogFooter>
            <Button
              disabled={!isUnique || isChecking || inputUsername === username || !inputUsername}
              onClick={updateUsername}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2" /> Saving
                </>
              ) : (
                "Change Username"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  );
}

export default ChangeUsername;
