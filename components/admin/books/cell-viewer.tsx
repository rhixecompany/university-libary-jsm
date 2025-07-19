'use client'


import {

    TrendingUpIcon,
} from 'lucide-react'


import { useIsMobile } from '@/hooks/use-mobile'

import { Button } from '@/components/ui/button'


import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'


import { Textarea } from '@/components/ui/textarea'




export function CellViewer({ item }: { item: Book }) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="link" className="text-foreground w-fit px-0 text-left">
                    {item.title}
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col">
                <SheetHeader className="gap-1">
                    <SheetTitle>{item.title}</SheetTitle>
                    <SheetDescription>
                        Showing total visitors for the last 6 months
                    </SheetDescription>
                </SheetHeader>
                <div className="flex flex-1 flex-col gap-4 overflow-y-auto py-4 text-sm">
                    <form className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" defaultValue={item.title} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="author">Author</Label>
                                <Select defaultValue={item.author}>
                                    <SelectTrigger id="author" className="w-full">
                                        <SelectValue placeholder="Select a author" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Table of Contents">
                                            Table of Contents
                                        </SelectItem>
                                        <SelectItem value="Executive Summary">
                                            Executive Summary
                                        </SelectItem>
                                        <SelectItem value="Technical Approach">
                                            Technical Approach
                                        </SelectItem>
                                        <SelectItem value="Design">Design</SelectItem>
                                        <SelectItem value="Capabilities">Capabilities</SelectItem>
                                        <SelectItem value="Focus Documents">
                                            Focus Documents
                                        </SelectItem>
                                        <SelectItem value="Narrative">Narrative</SelectItem>
                                        <SelectItem value="Cover Page">Cover Page</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="genre">Genre</Label>
                                <Input id="genre" defaultValue={item.genre} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="rating">Rating</Label>
                                <Input id="rating" defaultValue={item.rating} />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="totalCopies">TotalCopies</Label>
                                <Input id="totalCopies" defaultValue={item.totalCopies} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" defaultValue={item.description} />

                        </div>
                    </form>
                </div>
                <SheetFooter className="mt-auto flex gap-2 sm:flex-col sm:space-x-0">
                    <Button className="w-full">Submit</Button>
                    <SheetClose asChild>
                        <Button variant="outline" className="w-full">
                            Done
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

