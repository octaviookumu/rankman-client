"use client";
import AllToasts from "@/components/ui/AllToasts";
import Loader from "@/components/ui/Loader";
import { stopLoading } from "@/redux/features/poll-slice";
import { AppDispatch, RootState } from "@/redux/store";
import { useSocketWithHandlers } from "@/utils/socket-io";
import { colorizeText } from "@/utils/util";
import React, { useEffect, useState } from "react";
import { MdContentCopy, MdPeopleOutline } from "react-icons/md";
import { BsPencilSquare } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useCopyToClipboard } from "react-use";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
import { useRouter } from "next/navigation";
import ParticipantList from "@/components/ui/ParticipantList";
import NominationForm from "@/components/ui/NominationForm";
import { selectHasVoted } from "@/redux/selectors";
import {
  FormattedParticipants,
  Participant,
  Poll,
} from "../types/poll-interfaces";

const WaitingRoom = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const state = useSelector((state: RootState) => state.pollReducer.value);
  const nominationsCount = useSelector((state: RootState) => {
    return Object.keys(state.pollReducer.value.poll?.nominations || {}).length;
  });
  const canStartVoteStatus = useSelector((state: RootState) => {
    return (
      nominationsCount >= (state.pollReducer.value.poll?.votesPerVoter ?? 100)
    );
  });
  const {
    socketWithHandlers,
    removeParticipant,
    nominate,
    removeNomination,
    startVote,
    resetPoll,
  } = useSocketWithHandlers(state);
  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const [isParticipantListOpen, setIsParticipantListOpen] = useState(false);
  const [isNominationFormOpen, setIsNominationFormOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [participantToRemove, setParticipantToRemove] = useState("");
  const [showLeavePollConfirmation, setShowLeavePollConfirmation] =
    useState(false);
  const [participantsObj, setParticipantsObj] = useState<FormattedParticipants>(
    {}
  );
  const hasVoted = useSelector(selectHasVoted);

  const confirmRemoveParticipant = (id: string) => {
    if (state.poll?.participants) {
      const pollParticipant = getParticipant(state.poll?.participants, id);
      setConfirmationMessage(`Remove ${pollParticipant?.id} from poll`);
      setParticipantToRemove(id);
      setIsConfirmationOpen(true);
    }
  };

  const submitRemoveParticipant = () => {
    participantToRemove && removeParticipant(participantToRemove);
    setIsConfirmationOpen(false);
  };

  const getParticipant = (
    participants: Participant[] | undefined,
    id: string | undefined
  ) => {
    console.log("participants", participants);
    if (!participants) false;
    const pollParticipant = participants?.find(
      (participant) => participant.id === id
    );
    console.log("pollParticipant", pollParticipant);
    return pollParticipant;
  };

  const formatParticipants = (poll: Poll | undefined): void => {
    console.log("format participants", poll);
    const formattedParticipants = poll?.participants?.reduce(
      (result, participant) => {
        result[participant.id] = participant;
        return result;
      },
      {} as FormattedParticipants
    );
    if (formattedParticipants) {
      setParticipantsObj(formattedParticipants);
    }
    console.log("formattedParticipants output", formattedParticipants);
  };

  useEffect(() => {
    console.log("Waiting room useEffect");
    formatParticipants(state.poll);
    if (socketWithHandlers && !socketWithHandlers?.connected) {
      socketWithHandlers.connect();
    }

    // Resets page when a participant is deleted
    const myID = state.me?.id;
    // const participants = participantsObj as FormattedParticipants;

    if (myID && socketWithHandlers?.connected && !participantsObj[myID]) {
      console.log("attempts to reset poll");
      resetPoll();
    }

    if (myID && state.poll?.hasStarted) {
      router.push("/voting");
    }

    dispatch(stopLoading());
  }, [
    state.poll?.participants,
    // state.me?.id,
    // state.poll?.hasStarted,
    hasVoted,
  ]);

  // Resets page when a participant is deleted
  // useEffect(() => {
  //   const myID = state.me?.id;
  //   // const participants = participantsObj as FormattedParticipants;

  //   if (myID && socketWithHandlers?.connected && !participantsObj[myID]) {
  //     console.log("attempts to reset poll");
  //     resetPoll();
  //   }

  //   if (myID && state.poll?.hasStarted) {
  //     router.push("/voting");
  //   }
  // }, [
  //   state.poll?.participants,
  //   // state.me?.id,
  //   // state.poll?.hasStarted,
  //   hasVoted,
  // ]);

  return (
    <>
      {state.isLoading ? (
        <Loader color="orange" width={120}></Loader>
      ) : (
        <>
          {state.wsErrors.length > 0 && (
            <AllToasts wsErrors={state.wsErrors}></AllToasts>
          )}
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ y: 300, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{
                type: "spring",
                delay: 0.2,
              }}
            >
              <div className="flex flex-col w-[85%] md:w-[45%] h-[100svh] mx-auto items-center justify-between py-[5%]">
                <div className="flex flex-col text-center">
                  <h2>Poll Topic</h2>
                  <p className="italic mb-4">{state.poll?.topic}</p>
                  <h2>Poll ID</h2>
                  <h3 className="mb-2">Click to copy!</h3>
                  <button
                    onClick={() => copyToClipboard(state.poll?.id || "")}
                    className="mb-4 flex justify-center align-middle cursor-pointer"
                  >
                    <div className="font-extrabold text-center mr-2">
                      {state.poll && colorizeText(state.poll?.id)}
                    </div>
                    <MdContentCopy size={24} />
                  </button>
                </div>
                <div className="flex justify-center">
                  <button
                    className="box btn-orange mx-2 pulsate"
                    onClick={() => setIsParticipantListOpen(true)}
                  >
                    <MdPeopleOutline size={24} />
                    <span>{(state.poll?.participants || []).length}</span>
                  </button>
                  <button
                    className="box btn-purple mx-2 pulsate"
                    onClick={() => setIsNominationFormOpen(true)}
                  >
                    <BsPencilSquare size={24} />
                    <span>{nominationsCount}</span>
                  </button>
                </div>
                <div className="flex flex-col justify-center">
                  {state.isAdmin ? (
                    <>
                      <div className="my-2 italic">
                        {state.poll?.votesPerVoter} Nominations Required to
                        Start!
                      </div>
                      <button
                        className="box btn-orange my-2"
                        disabled={!canStartVoteStatus}
                        onClick={startVote}
                      >
                        Start Voting
                      </button>
                    </>
                  ) : (
                    <div className="my-2 italic">
                      (
                      {state.poll && participantsObj[state.poll.adminID] ? (
                        <span className="font-semibold">
                          Waiting for Admin{" "}
                          {participantsObj[state.poll.adminID].name}
                        </span>
                      ) : (
                        <span>No admin found</span>
                      )}
                      ), to start the voting.
                    </div>
                  )}
                  <button
                    className="box btn-purple my-2"
                    onClick={() => setShowLeavePollConfirmation(true)}
                  >
                    Leave Poll
                  </button>

                  {/* Removing yourself */}
                  <ConfirmationDialog
                    message="You will be kicked out of the poll"
                    showDialog={showLeavePollConfirmation}
                    onCancel={() => setShowLeavePollConfirmation(false)}
                    onConfirm={resetPoll}
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <ParticipantList
            isOpen={isParticipantListOpen}
            onClose={() => setIsParticipantListOpen(false)}
            participants={state.poll?.participants}
            onRemoveParticipant={confirmRemoveParticipant}
            isAdmin={state.isAdmin || false}
            userID={state.me?.id}
          />

          <NominationForm
            title={state.poll?.topic}
            isOpen={isNominationFormOpen}
            onClose={() => setIsNominationFormOpen(false)}
            onSubmitNomination={(nominationText) => nominate(nominationText)}
            nominations={state.poll?.nominations}
            userID={state.me?.id}
            onRemoveNomination={(nominationID) =>
              removeNomination(nominationID)
            }
            isAdmin={state.isAdmin || false}
          />

          {/* Removing the participant */}
          <ConfirmationDialog
            message={confirmationMessage}
            showDialog={isConfirmationOpen}
            onCancel={() => setIsConfirmationOpen(false)}
            onConfirm={submitRemoveParticipant}
          />
        </>
      )}
    </>
  );
};

export default WaitingRoom;
