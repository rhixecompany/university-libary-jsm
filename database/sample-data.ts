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
    password: 'R4I7gcJHX',
    role: 'ADMIN',
    universityId: 41695,
    universityCard: "https://github.com/shadcn.png",
  },
  {
    fullName: 'Admin',
    email: 'admin@rhixecompany.online',
    password: 'R4I7gcJHX',
    role: 'ADMIN',
    universityId: 41696,
    universityCard: "https://github.com/shadcn.png",
  },
  {
    fullName: 'Jamik Tashpulatov',
    email: 'jamik@prisma.io',
    password: '123456',
    role: 'USER',
    universityId: 41697,
    universityCard: "https://github.com/shadcn.png",
  },
  {
    fullName: 'Eddie Lake',
    email: 'eddie@prisma.io',
    password: 'sdfghsvrg',
    role: 'USER',
    universityId: 41698,
    universityCard: "https://github.com/shadcn.png",
  },
]

export default users;
