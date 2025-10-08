import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.post("/api/auth/verifyToken", { token });
          if (response.data.valid) {
            setIsLoggedIn(true);
          } else {
            router.push("/login");
          }
        } catch (error) {
          console.error("Token verification failed:", error);
          router.push("/login");
        }
      } else {
        router.push("/login");
      }
      setIsLoading(false);
    };

    verifyToken();
  }, [router]);

  if (isLoading) {
    return null;
  }

  return isLoggedIn ? <Dashboard /> : null;
}