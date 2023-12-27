import { FormattedParticipants, Poll } from "@/app/types/poll-interfaces";
import { StateType } from "@/redux/features/poll-slice";

type TokenPayload = {
  iat: number;
  exp: number;
  sub: string;
  name: string;
  pollID: string;
};

export const getTokenPayload = (accessToken: string): TokenPayload => {
  return JSON.parse(window.atob(accessToken.split(".")[1]));
};

export const setLocalStorageAccessToken = (accessToken: string) => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
  }
};

export const colorizeText = (text: string): JSX.Element => {
  const elements: JSX.Element[] = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const isDigit = char >= "0" && char <= "9";

    elements.push(
      <span key={i} className={isDigit ? "text-orange" : "text-indigo"}>
        {char}
      </span>
    );
  }

  return <>{elements}</>;
};

export const formatParticipants = (
  poll: Poll | undefined
): FormattedParticipants | undefined => {
  console.log("format participants", poll?.participants);
  const formattedParticipants = poll?.participants?.reduce(
    (result, participant) => {
      result[participant.id] = participant;
      return result;
    },
    {} as FormattedParticipants
  );
  console.log("formatted participants", formattedParticipants);
  return formattedParticipants;
};
