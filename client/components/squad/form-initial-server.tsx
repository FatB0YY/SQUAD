'use client'

import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { ServerInitialSchema } from '@/schemas'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { DialogFooter } from '@/components/ui/dialog'
import { FileUpload } from '@/components/squad/file-upload'
import { initialServer } from '@/actions/initial-server'
import { FormError } from '../form-error'
import { FormSuccess } from '../form-success'

export const FormInitialServer = () => {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>(undefined)
  const [success, setSuccess] = useState<string | undefined>(undefined)

  const form = useForm({
    resolver: zodResolver(ServerInitialSchema),
    defaultValues: {
      name: '',
      image: ''
    }
  })

  const router = useRouter()

  const isLoading = form.formState.isSubmitting || isPending

  const onSubmit = (values: z.infer<typeof ServerInitialSchema>) => {
    startTransition(() => {
      initialServer(values)
        .then((data) => {
          if (data?.error) {
            setError(data.error)
          }

          if (data?.success) {
            setSuccess(data.success)

            form.reset()
            router.refresh()
            window.location.reload()
          }
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-4'
      >
        <div className='space-y-8 px-6'>
          <div className='flex items-center justify-center text-center'>
            <FormField
              control={form.control}
              name='image'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FileUpload
                      endpoint='serverImage'
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                  Server name
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    className='bg-zinc-300/50 border-0 peer-focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                    placeholder='Enter server name'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormError message={error} />
          <FormSuccess message={success} />
        </div>

        <DialogFooter className='bg-gray-100 px-6 py-4'>
          <Button
            variant='primary'
            disabled={isLoading}
            type='submit'
          >
            Create
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
