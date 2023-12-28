import { PollState, reset } from "@/redux/features/poll-slice";
import { AppDispatch } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Socket } from "socket.io-client";
import { initializeSocket, disconnectSocket } from "./socketManager";

export const socketIOUrl = `http://${process.env.NEXT_PUBLIC_API_HOST}:${process.env.NEXT_PUBLIC_API_PORT}/${process.env.NEXT_PUBLIC_POLLS_NAMESPACE}`;

export const useSocketWithHandlers = (pollState: PollState) => {
  const dispatch = useDispatch<AppDispatch>();
  const socketRef = useRef<Socket | undefined>(undefined);
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>("");

  const nominate = (text: string): void => {
    socketRef.current?.emit("nominate", { text });
  };

  const removeNomination = (id: string): void => {
    socketRef.current?.emit("remove_nomination", { id });
  };

  const removeParticipant = (id: string): void => {
    socketRef.current?.emit("remove_participant", { id });
  };

  const startVote = () => {
    socketRef.current?.emit("start_vote");
  };

  const submitRankings = (rankings: string[]) => {
    socketRef.current?.emit("submit_rankings", { rankings });
    // console.log('pollState', pollState)
    router.push("/results");
  };

  const cancelPoll = () => {
    socketRef.current?.emit("cancel_poll");
    resetPoll();
  };

  const closePoll = () => {
    socketRef.current?.emit("close_poll");
    router.push("/results");
  };

  const resetPoll = () => {
    socketRef.current?.disconnect();
    dispatch(reset());
    localStorage.removeItem("accessToken");
    router.push("/");
  };

  useEffect(() => {
    setAccessToken(localStorage.getItem("accessToken"));
    console.log("useSocketWithHandlers useeffect", pollState, accessToken);
    if (accessToken) {
      console.log("accessToken exists");
      socketRef.current = initializeSocket(accessToken, dispatch);
    } else {
      console.log("accessToken doesnt exist");
      disconnectSocket();
      return;
    }

    // return () => {
    //   console.log("cleanup");
    //   socketRef.current = undefined;
    //   disconnectSocket();
    // };
  }, [accessToken]);

  return {
    socketWithHandlers: socketRef.current,
    nominate,
    removeNomination,
    removeParticipant,
    startVote,
    submitRankings,
    cancelPoll,
    closePoll,
    resetPoll,
  };
};
