import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import BookForm from "@/components/admin/forms/BookForm";
import { sampleBooks } from "@/constants";

const Page = async ({
  params,
}: {
  params: Promise<{
    id: number;
  }>;
}) => {
  const pam = await params;
  const book = sampleBooks.find((book) => book.id == pam.id)
  return (
    <>
      <Button asChild className="back-btn">
        <Link href="/admin/books">Go Back</Link>
      </Button>

      <section className="w-full max-w-2xl">
        <BookForm type="update" book={book} />
      </section>
    </>
  );
};
export default Page;
