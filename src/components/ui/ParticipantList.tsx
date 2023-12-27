import { Participant } from "@/app/types/poll-interfaces";
import React from "react";
import { MdClose } from "react-icons/md";
import BottomSheet, { BottomSheetProps } from "./BottomSheet";

type ParticipantListProps = {
  participants?: Participant[];
  userID?: string;
  isAdmin: boolean;
  onRemoveParticipant: (id: string) => void;
} & BottomSheetProps;

const ParticipantList: React.FC<ParticipantListProps> = ({
  isOpen,
  onClose,
  participants,
  onRemoveParticipant,
  userID,
  isAdmin,
}) => {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="px-8 flex flex-wrap justify-center mb-2">
        {participants &&
          participants.map((participant) => (
            <div
              key={participant.id}
              className="mx-1 my-1 p-4 shadow-xl bg-white flex justify-between items-center rounded-md"
            >
              <span className="ml-2 mr-1 text-indigo-700 text-xl text-center">
                {participant.name}
              </span>
              {isAdmin && userID !== participant.id && (
                <span
                  className="ml-1 mr-2 cursor-pointer"
                  onClick={() => onRemoveParticipant(participant.id)}
                >
                  <MdClose
                    className="fill-current text-black align-middle"
                    size={18}
                  />
                </span>
              )}
            </div>
          ))}
      </div>
    </BottomSheet>
  );
};

export default ParticipantList;
