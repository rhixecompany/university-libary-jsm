import { config } from "dotenv";

config({ path: ".env.local" });

interface UserCredentials {
  fullName: string;
  email: string;
  password: string;
  universityId: number;
  universityCard: string;
  role: "ADMIN" | "USER";
}
const users: UserCredentials[] = [
  {
    fullName: 'Alexander',
    email: 'alexanderrhixe30@gmail.com',
    password: `${process.env.CRD_PASSWORD!}`,
    role: 'USER',
    universityId: 41695,
    universityCard: "https://github.com/shadcn.png",
  },
  {
    fullName: 'Admin',
    email: 'rhixecompany@gmail.com',
    password: process.env.CRD_PASSWORD!,
    role: 'ADMIN',
    universityId: 41696,
    universityCard: "https://github.com/shadcn.png",
  },
]

export default users;
