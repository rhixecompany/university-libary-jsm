import datausers from './sample-data';
// import dummyUsers from "../dummyusers.json";
import ImageKit from "imagekit";
// import { users } from "@/database/schema";
import { users } from "@/database/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { config } from "dotenv";
import { hashPassword } from "@/lib/encrypt";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });



const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
});

const uploadToImageKit = async (
    url: string,
    fileName: string,
    folder: string,
) => {
    try {
        const response = await imagekit.upload({
            file: url,
            fileName,
            folder,
        });

        return response.filePath;
    } catch (error) {
        console.error("Error uploading image to ImageKit:", error);
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
    console.log("Seeding data...");
    await db
        .delete(users)
    try {
        for (let i = 0; i < datausers.length; i++) {
            const hashedPassword = await hashPassword(datausers[i].password, 10);
            const newuniversityCard = (await uploadToImageKit(
                datausers[i].universityCard,
                getFilenameFromUrl(datausers[i].universityCard),
                "ids",
            ))!;
            await db.insert(users).values({
                ...datausers[i],
                password: hashedPassword,
                universityCard: newuniversityCard
            });
            console.log(`Added user: ${datausers[i].email}`);
        }
        // for (const user of dummyUsers) {
        //     const coverUrl = (await uploadToImageKit(
        //         user.coverUrl,
        //         getFilenameFromUrl(user.coverUrl),
        //         "/users/covers",
        //     )) as string;

        //     const videoUrl = (await uploadToImageKit(
        //         user.videoUrl,
        //         getFilenameFromUrl(user.videoUrl),
        //         "/users/videos",
        //     )) as string;

        //     await db.insert(users).values({
        //         ...user,
        //         coverUrl,
        //         videoUrl,
        //     });
        //     console.log(`Added user: ${user.title}`);
        // }

        console.log("Data seeded successfully!");
    } catch (error) {
        console.error("Error seeding data:", error);
    }
};

seed();
