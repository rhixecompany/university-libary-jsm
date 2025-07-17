import { books, borrowRecords, users } from '@/database/schema';
import ImageKit from 'imagekit';
import dummyBooks from './dummybooks';
import datausers from './sample-users';
import type { InsertBook } from '@/database/schema';
import { hash } from '@/lib/encrypt';
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-http';
import slugify from 'slugify';
config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
});

const uploadToImageKit = async (url: string, fileName: string, folder: string, overwriteFile: boolean, useUniqueFileName: boolean) => {
  try {
    const response = await imagekit.upload({
      file: url,
      fileName,
      folder,
      overwriteFile,
      useUniqueFileName
    });

    return response.filePath;
  } catch (error) {
    console.error('Error uploading image to ImageKit:', error);
  }
};

function getFilenameFromUrl(url: string): string {
  const lastSlashIndex = url.lastIndexOf('/');
  let filename = url.substring(lastSlashIndex + 1);

  const queryParamIndex = filename.indexOf('?');
  if (queryParamIndex !== -1) {
    filename = filename.substring(0, queryParamIndex);
  }

  return filename;
}

const seed = async () => {
  console.log('Deleting users and books..');
  await db.delete(borrowRecords);
  await db.delete(books);
  await db.delete(users);
  try {
    for (const user of datausers) {

      const password = await hash(user.password);
      const avatar = (await uploadToImageKit(user.avatar, getFilenameFromUrl(user.avatar), '/users', true, false)) as string;
      await db.insert(users).values({
        ...user,
        password,
        avatar,
      });
      console.log(`Added user email: ${user.email}, avatar: ${avatar}`);
    }
    const allusers = await db.select().from(users);
    console.log('Getting all users from the database: ', allusers);
  } catch (error) {
    console.error('Error creating users:', error);
  }
  try {
    for (const book of dummyBooks) {
      const sluggedValue = slugify(book.title, { lower: true, strict: true });
      const cleanedSlug = sluggedValue.replace(/[^a-z0-9-]/g, '');
      // const coverUrl = (await uploadToImageKit(book.coverUrl, getFilenameFromUrl(book.coverUrl), `/books/${cleanedSlug}/covers`, true, false)) as string;

      // const videoUrl = (await uploadToImageKit(book.videoUrl, getFilenameFromUrl(book.videoUrl), `/books/${cleanedSlug}/videos`, true, false)) as string;
      const coverUrl = (await uploadToImageKit(book.coverUrl, getFilenameFromUrl(book.coverUrl), '/books/covers', true, false)) as string;

      const videoUrl = (await uploadToImageKit(book.videoUrl, getFilenameFromUrl(book.videoUrl), '/books/videos', true, false)) as string;
      const item: InsertBook = {
        ...book,
        coverUrl: coverUrl,
        videoUrl: videoUrl,
        slug: cleanedSlug
      }
      if (item) {
        await db.insert(books).values(item);
        console.log(`Added title: ${item.title} , slug: ${item.slug}, coverUrl: ${item.coverUrl}, videoUrl: ${item.videoUrl}`);
      } else {
        console.error('Error creating book:', book);
      }

    }
    const allbooks = await db.select().from(books);
    console.log('Getting all books from the database: ', allbooks);

  } catch (error) {
    console.error('Error creating books:', error);
  }
  try {
    await db
      .update(users)
      .set({
        name: 'rhixeero',
      })
      .where(eq(users.email, 'rhixeero@gmail.com'));
    console.log('User info updated!');
    // await db.delete(users).where(eq(users.email, 'rhixeero@gmail.com'));
    // console.log('User deleted!');
  } catch (error) {
    console.error('Error updating data:', error);
  }
  console.log('Data seeded successfully!');
};

seed();
