// Placeholder data: the members of the current team and the people invited to it.

export const roles = ["admin", "builder", "viewer"] as const;
export type Role = (typeof roles)[number];

export const roleIcons: Record<Role, string> = {
  admin: "regular-user-shield",
  builder: "regular-code",
  viewer: "regular-eye",
};

export interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  joinedMinutesAgo: number;
  /** The logged-in user. */
  isCurrentUser?: boolean;
}

export interface Invite {
  id: string;
  email: string;
  role: Role;
  invitedBy: string;
  /** Negative while it is still valid. */
  expiresInMinutes: number;
}

const day = 60 * 24;

export const members: Member[] = [
  {
    id: "jane",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    role: "admin",
    joinedMinutesAgo: 210 * day,
    isCurrentUser: true,
  },
  {
    id: "elif",
    name: "Elif Weber",
    email: "elif.weber@example.com",
    role: "admin",
    joinedMinutesAgo: 182 * day,
  },
  {
    id: "anna",
    name: "Anna Yilmaz",
    email: "anna.yilmaz@example.com",
    role: "builder",
    joinedMinutesAgo: 64 * day,
  },
  {
    id: "ben",
    name: "Ben Hoffmann",
    email: "ben.hoffmann@example.com",
    role: "builder",
    joinedMinutesAgo: 41 * day,
  },
  {
    id: "david",
    name: "David Hartmann",
    email: "david.hartmann@example.com",
    role: "builder",
    joinedMinutesAgo: 15 * day,
  },
  {
    id: "greta",
    name: "Greta Braun",
    email: "greta.braun@example.com",
    role: "viewer",
    joinedMinutesAgo: 25 * day,
  },
  {
    id: "clara",
    name: "Clara Neumann",
    email: "clara.neumann@example.com",
    role: "viewer",
    joinedMinutesAgo: 12 * day,
  },
  {
    id: "felix",
    name: "Felix Koch",
    email: "felix.koch@example.com",
    role: "viewer",
    joinedMinutesAgo: 3 * day,
  },
];

export const invites: Invite[] = [
  {
    id: "invite-1",
    email: "sam.schmidt@example.com",
    role: "builder",
    invitedBy: "Jane Doe",
    expiresInMinutes: 2 * day,
  },
  {
    id: "invite-2",
    email: "lena.becker@example.com",
    role: "viewer",
    invitedBy: "Elif Weber",
    expiresInMinutes: 18 * 60,
  },
];
