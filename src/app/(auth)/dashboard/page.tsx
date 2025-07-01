"use client";
import { Message } from "@/model/user";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useState } from "react";
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
  const accceptMessages = watch("accepMessage");

  const fetchAcceptMessage = useCallback(async () => {
    setisSwitching(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-message");
      setMessages(response.data.Messages || []);
      if (refresh) {
        toast.error("Error!", {
          description:
            AxiosError.response?.data.message ||
            "Failed to fetch message setting",
        });
      }
    } catch (error) {}
  }, [setValue]);

  return <div>Dashboard content will be available here</div>;
};

export default Dashboard;
