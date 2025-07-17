import type { InsertUser } from '@/database/schema';
import { config } from 'dotenv';

config({ path: '.env.local' });

const data: InsertUser[] = [
  {
    name: 'Alexander',
    email: 'alexanderrhixe30@gmail.com',
    password: `${process.env.CRD_PASSWORD!}`,
    role: 'USER',
    // universityId: 41695,
    avatar: 'https://ik.imagekit.io/4jqihqoue/default-image.jpg?updatedAt=1751374108725',
  },
  {
    name: 'Admin',
    email: 'rhixecompany@gmail.com',
    password: process.env.CRD_PASSWORD!,
    role: 'ADMIN',
    // universityId: 41696,
    avatar: 'https://ik.imagekit.io/4jqihqoue/default-image.jpg?updatedAt=1751374108725',
  },
  {
    name: 'Test',
    email: 'rhixeero@gmail.com',
    password: `${process.env.CRD_PASSWORD!}`,
    role: 'USER',
    // universityId: 41697,
    avatar: 'https://ik.imagekit.io/4jqihqoue/default-image.jpg?updatedAt=1751374108725',
  },
];

export default data;
