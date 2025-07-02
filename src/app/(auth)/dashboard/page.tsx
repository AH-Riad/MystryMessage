"use client";
import { Message } from "@/model/user";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [swtiching, setisSwitching] = useState(false);

  const handleMessage = (messgaeId: string) => {
    setMessages(messages.filter((message) => message._id !== messgaeId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setisSwitching(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-message");
      setValue("acceptMessages", response.data.isAcceptingMessages ?? true);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response) {
        toast.error(
          axiosError.response.data.message ||
            "Failed to fetch message acceptance status"
        );
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setisSwitching(false);
    }
  }, [setValue]);

  const fetchMessage = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>("/api/get-message");
        setMessages(response.data.Messages || []);
        if (refresh) {
          toast.success("Refreshed!", {
            description: "Message refreshed successful",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        if (axiosError.response) {
          toast.error(
            axiosError.response.data.message ||
              "Failed to fetch message acceptance status"
          );
        } else {
          toast.error("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
        setisSwitching(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessage();
    fetchAcceptMessage();
  }, [session, setValue, fetchAcceptMessage, fetchMessage]);

  //handle switch change
  const handleSwitch = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-message", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast.success(response.data.message, {});
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message, {});
    }
  };
  const username = session?.user?.username;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Copied");
  };

  if (!session || !session.user) {
    return <div>Please LogIn</div>;
  }
  return <div>Dashboard content will be available here</div>;
};

export default Dashboard;
