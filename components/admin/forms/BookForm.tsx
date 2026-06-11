'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { bookSchema } from '@/lib/validations'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import FileUpload from '@/components/FileUpload'
import ColorPicker from '@/components/admin/ColorPicker'
import { createBook, updateBook } from '@/lib/admin/actions/book'
import { toast } from 'sonner'

interface Props extends Partial<Book> {
  type?: 'create' | 'update'
}

const BookForm = ({ type, ...book }: Props) => {
  const isCreate = type === 'create'
  const router = useRouter()

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
  })

  // const onSubmit = async (values: z.infer<typeof bookSchema>) => { }
  const onSubmit = async (values: z.infer<typeof bookSchema>) => {
    if (isCreate) {
      const result = await createBook(values)

      if (result.success) {
        // toast({
        //   title: 'Success',
        //   description: 'Book created successfully',
        // });
        toast.success(`Book created successfully`)

        router.push(`/admin/books/${result.data.id}`)
      } else {
        // toast({
        //   title: 'Error',
        //   description: result.message,
        //   variant: 'destructive',
        // });
        toast.error(`${result.message}`)
      }
    } else {
      if (book) {
        const data = {
          title: values.title,
          description: values.description,
          author: values.author,
          genre: values.genre,
          rating: values.rating,
          totalCopies: values.totalCopies,
          coverUrl: values.coverUrl,
          coverColor: values.coverColor,
          videoUrl: values.videoUrl,
          summary: values.summary,
        }
        const id = book.id!
        const result = await updateBook(id, data)

        if (result.success) {
          // toast({
          //   title: 'Success',
          //   description: 'Book updated successfully',
          // });
          toast.success(`Book updated successfully`)

          router.push(`/admin/books/${result.data.id}`)
        } else {
          // toast({
          //   title: 'Error',
          //   description: result.message,
          //   variant: 'destructive',
          // });
          toast.error(`${result.message}`)
        }
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name={'title'}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-dark-500 text-base font-normal">
                Book Title
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder="Book title"
                  {...field}
                  className="book-form_input"
                />
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
              <FormLabel className="text-dark-500 text-base font-normal">
                Author
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder="Book author"
                  {...field}
                  className="book-form_input"
                />
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
              <FormLabel className="text-dark-500 text-base font-normal">
                Genre
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder="Book genre"
                  {...field}
                  className="book-form_input"
                />
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
              <FormLabel className="text-dark-500 text-base font-normal">
                Rating
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  placeholder="Book rating"
                  {...field}
                  className="book-form_input"
                />
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
              <FormLabel className="text-dark-500 text-base font-normal">
                Total Copies
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={10000}
                  placeholder="Total copies"
                  {...field}
                  className="book-form_input"
                />
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
              <FormLabel className="text-dark-500 text-base font-normal">
                Book Image
              </FormLabel>
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
              <FormLabel className="text-dark-500 text-base font-normal">
                Primary Color
              </FormLabel>
              <FormControl>
                <ColorPicker
                  onPickerChange={field.onChange}
                  value={field.value}
                />
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
              <FormLabel className="text-dark-500 text-base font-normal">
                Book Description
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Book description"
                  {...field}
                  rows={10}
                  className="book-form_input"
                />
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
              <FormLabel className="text-dark-500 text-base font-normal">
                Book Trailer
              </FormLabel>
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
              <FormLabel className="text-dark-500 text-base font-normal">
                Book Summary
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Book summary"
                  {...field}
                  rows={5}
                  className="book-form_input"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="book-form_btn text-white">
          {type} Book
        </Button>
      </form>
    </Form>
  )
}
export default BookForm
