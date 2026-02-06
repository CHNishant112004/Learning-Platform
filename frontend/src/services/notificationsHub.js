import * as signalR from "@microsoft/signalr";
import { getCookie } from "../utils/cookies.js";

export const createNotificationHub = () => {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
  return new signalR.HubConnectionBuilder()
    .withUrl(`${baseUrl}/hubs/notifications`, {
      accessTokenFactory: () => getCookie("token") || ""
    })
    .withAutomaticReconnect()
    .build();
};
