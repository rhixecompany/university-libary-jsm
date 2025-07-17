/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';

import FileUpload from '@/components/FileUpload';
import ColorPicker from '@/components/admin/ColorPicker';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { createBook, updateBook } from '@/lib/admin/actions/book';
import { bookSchema } from '@/lib/validations';
import { useRouter } from 'next/navigation';

interface Props {
  type: 'create' | 'update';
  book?: Book;
}

const BookForm = ({ type, book }: Props) => {
  const isCreate = type === 'create';
  const router = useRouter();

  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: isCreate ? '' : book?.title,
      description: isCreate ? '' : book?.description,
      author: isCreate ? '' : book?.author,
      genre: isCreate ? '' : book?.genre,
      rating: isCreate ? 1 : book?.rating,
      totalCopies: isCreate ? 1 : book?.totalCopies,
      coverUrl: isCreate ? '' : book?.coverUrl,
      coverColor: isCreate ? '' : book?.coverColor,
      videoUrl: isCreate ? '' : book?.videoUrl,
      summary: isCreate ? '' : book?.summary,
    },
  });

  const onSubmit = async (data: z.infer<typeof bookSchema>) => {
    // toast({
    //   title: "Info",
    //   description: `
    //    Submitted : ${JSON.stringify(data, null, 2)} `,
    // });
    if (isCreate) {
      const result = await createBook(data);

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Book created successfully',
        });

        router.push(`/admin/books/${result.data.id}`);
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
      }
    } else {
      if (book) {
        const values = {
          id: book.id,
          title: data.title,
          description: data.description,
          author: data.author,
          genre: data.genre,
          rating: data.rating,
          totalCopies: data.totalCopies,
          coverUrl: data.coverUrl,
          coverColor: data.coverColor,
          videoUrl: data.videoUrl,
          summary: data.summary,
        };
        const result = await updateBook(values);

        if (result.success) {
          toast({
            title: 'Success',
            description: 'Book updated successfully',
          });

          router.push(`/admin/books/${result.data.id}`);
        } else {
          toast({
            title: 'Error',
            description: result.message,
            variant: 'destructive',
          });
        }
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name={'title'}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">Book Title</FormLabel>
              <FormControl>
                <Input required placeholder="Book title" {...field} className="book-form_input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={'author'}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">Author</FormLabel>
              <FormControl>
                <Input required placeholder="Book author" {...field} className="book-form_input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={'genre'}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">Genre</FormLabel>
              <FormControl>
                <Input required placeholder="Book genre" {...field} className="book-form_input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={'rating'}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">Rating</FormLabel>
              <FormControl>
                <Input type="number" min={1} max={5} placeholder="Book rating" {...field} className="book-form_input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={'totalCopies'}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">Total Copies</FormLabel>
              <FormControl>
                <Input type="number" min={1} max={10000} placeholder="Total copies" {...field} className="book-form_input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={'coverUrl'}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">Book Image</FormLabel>
              <FormControl>
                <FileUpload
                  type="image"
                  accept="image/*"
                  placeholder="Upload a book cover"
                  folder="books/covers"
                  variant="light"
                  onFileChange={field.onChange}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={'coverColor'}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">Primary Color</FormLabel>
              <FormControl>
                <ColorPicker onPickerChange={field.onChange} value={field.value} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={'description'}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">Book Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Book description" {...field} rows={10} className="book-form_input" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={'videoUrl'}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">Book Trailer</FormLabel>
              <FormControl>
                <FileUpload
                  type="video"
                  accept="video/*"
                  placeholder="Upload a book trailer"
                  folder="books/videos"
                  variant="light"
                  onFileChange={field.onChange}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={'summary'}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">Book Summary</FormLabel>
              <FormControl>
                <Textarea placeholder="Book summary" {...field} rows={5} className="book-form_input" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="book-form_btn text-white">
          Add Book to Library
        </Button>
      </form>
    </Form>
  );
};
export default BookForm;
