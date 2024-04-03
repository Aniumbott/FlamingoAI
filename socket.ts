"use client";

// import { useEffect } from "react";
import { io } from "socket.io-client";

export const socket = io();

// useEffect(() => {
//     if (socket.connected) {
//       onConnect();
//     }

//     function onConnect() {
//       console.log( "isConnected");
//       socket.io.engine.on("upgrade", (transport) => {
//       });
//     }

//     function onDisconnect() {
//     }

//     socket.on("connect", onConnect);
//     socket.on("disconnect", onDisconnect);

//     return () => {
//       socket.off("connect", onConnect);
//       socket.off("disconnect", onDisconnect);
//     };
//   }, []);