"use client";
import React, { useState } from "react";
import { MdCancel } from "react-icons/md";
import { NominationData } from "../../app/types/poll-interfaces";
import BottomSheet, { BottomSheetProps } from "./BottomSheet";

type NominationFormProps = {
  title?: string;
  nominations?: NominationData[] | undefined;
  userID?: string;
  isAdmin: boolean;
  onSubmitNomination: (nomination: string) => void;
  onRemoveNomination: (nominationID: string) => void;
} & BottomSheetProps;

const NominationForm: React.FC<NominationFormProps> = ({
  isOpen,
  onClose,
  title,
  nominations = [],
  onSubmitNomination,
  onRemoveNomination,
  userID,
  isAdmin,
}) => {
  const [nominationText, setNominationText] = useState<string>("");

  const handleSubmitNomination = (nominationText: string) => {
    onSubmitNomination(nominationText);
    setNominationText("");
  };

  const getBoxStyle = (id: string): string => {
    return id === userID
      ? "bg-orange-100 flex-row"
      : "bg-gray-100 flex-row-reverse";
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col px-4 items-center mb-2">
        <h3 className="font-semibold">{title}</h3>
        <div className="w-full my-4">
          <textarea
            rows={2}
            maxLength={100}
            className="box info w-full"
            value={nominationText}
            onChange={(e) => setNominationText(e.currentTarget.value)}
          />
        </div>
        <button
          className="box btn-purple"
          disabled={!nominationText.length || nominationText.length > 100}
          onClick={() => handleSubmitNomination(nominationText)}
        >
          Nominate
        </button>

        <h2 className="text-center text-xl my-4 font-medium">Nominations</h2>
        <div className="w-full mb-2">
          {nominations &&
            nominations.map((nomination) => (
              <div
                key={nomination.id}
                className={`my-2 flex justify-between items-center p-2 rounded-md ${getBoxStyle(
                  nomination.nominationUserID
                )}`}
              >
                <div>{nomination.nominationText}</div>
                {isAdmin && (
                  <div className="ml-2">
                    <MdCancel
                      className="fill-current cursor-pointer hover:opacity-80"
                      onClick={() => onRemoveNomination(nomination.id)}
                      size={24}
                    />
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </BottomSheet>
  );
};

export default NominationForm;
