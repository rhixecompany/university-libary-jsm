'use client'

import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

export function SonnerDemo() {
  function handToast() {
    // toast('My first toast') default
    // toast(<div>A custom toast with default styling</div>) custom
    // toast.message('Event has been created', {
    //     description: 'Monday, January 3rd at 6:00pm',
    // })  description
    // toast.success('Event has been created') success
    // toast.info('Be at the area 10 minutes before the event time') info
    // toast.warning('Event start time cannot be earlier than 8am') warning
    // toast.error('Event has not been created') error
    // toast('Event has been created', {
    //     action: {
    //         label: 'Undo',
    //         onClick: () => console.log('Undo')
    //     },
    // }) action
    // const promise = () => new Promise((resolve) => setTimeout(() => resolve({ name: 'Sonner' }), 2000));

    // toast.promise(promise, {
    //     loading: 'Loading...',
    //     success: (data) => {
    //         return `${data.name} toast has been added`;
    //     },
    //     error: 'Error',
    // });
    // toast.custom((t) => (
    //     <div>
    //         <h1>Custom toast</h1>
    //         <button onClick={() => toast.dismiss(t)}>Dismiss</button>
    //     </div>
    // ));
    toast.success('Event has been created')
    // toast.success(``)
    // toast.info(``)
    // toast.error(``)
    // toast.warning(``)
  }
  return <Button onClick={handToast}>Give me a toast</Button>
}
