export interface Participant {
  id: string;
  name: string;
  rankings?: string[];
  pollID: string;
  poll?: Poll;
}

interface FormattedParticipant {
  name: string;
  rankings?: string[];
  pollID: string;
  poll?: Poll;
}

export interface FormattedParticipants {
  [participantId: string]: FormattedParticipant;
}

export interface Nomination {
  userID: string;
  text: string;
}

export interface NominationData {
  id: string;
  pollID: string;
  nominationUserID: string;
  nominationText: string;
}

export interface Result {
  nominationID: string;
  nominationText: string;
  score: number;
}

export interface Nomination {
  userID: string;
  text: string;
}

export interface Ranking {
  id: string;
  participant: Participant;
  participantRankings: string[];
  pollID: string;
  poll?: Poll;
}

export interface Poll {
  id: string;
  topic: string;
  votesPerVoter: number;
  adminID: string;
  hasStarted: boolean;
  participants?: Participant[] | undefined;
  nominations?: NominationData[] | undefined;
  rankings?: Ranking[] | undefined;
  results?: Result[] | undefined;
}

export interface FormattedNominations {
  [nominationID: string]: Nomination;
}

export interface FormattedRankings {
  [userID: string]: string[];
}
