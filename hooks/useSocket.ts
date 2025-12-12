"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SocketAlert, SocketLiveOccupancy } from "@/types";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [alerts, setAlerts] = useState<SocketAlert[]>([]);
  const [liveOccupancy, setLiveOccupancy] = useState<SocketLiveOccupancy | null>(null);

  useEffect(() => {
    const socketInstance = io(SOCKET_URL, {
      transports: ["websocket"],
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
      console.log("Socket connected");
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
      console.log("Socket disconnected");
    });

    socketInstance.on("alert", (data: SocketAlert) => {
      console.log("Alert received:", data);
      setAlerts((prev) => [data, ...prev].slice(0, 50)); // Keep last 50 alerts
    });

    socketInstance.on("live_occupancy", (data: SocketLiveOccupancy) => {
      console.log("Live occupancy update:", data);
      setLiveOccupancy(data);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return {
    socket,
    isConnected,
    alerts,
    liveOccupancy,
  };
}
