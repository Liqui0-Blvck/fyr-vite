import React from 'react'
import Icon from '../../components/icon/Icon'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

const SessionsComponent = () => {

  return (
  <>
    <div className='text-4xl font-semibold'>Newsletter</div>
    <div className='flex flex-wrap divide-y divide-dashed divide-zinc-500/50 [&>*]:py-4'>
      <div className='group flex basis-full gap-4'>
        <div className='flex grow items-center'>
          <div>
            <div className='text-xl font-semibold'>
              Chrome
            </div>
            <div className='text-zinc-500'>
              MacOS 13.4.1
            </div>
          </div>
          <Button
            className='invisible group-hover:visible'
            color='red'>
            Delete
          </Button>
        </div>
        <div className='flex flex-shrink-0 items-center gap-4'>
          <Icon icon='CustomUSA' size='text-3xl' />
          <Badge
            variant='outline'
            rounded='rounded-full'
            className='border-transparent'>
            3 hours ago
          </Badge>
        </div>
      </div>
      <div className='group flex basis-full gap-4'>
        <div className='flex grow items-center'>
          <div>
            <div className='text-xl font-semibold'>
              Safari
            </div>
            <div className='text-zinc-500'>
              MacOS 13.4.1
            </div>
          </div>
          <Button
            className='invisible group-hover:visible'
            color='red'>
            Delete
          </Button>
        </div>
        <div className='flex flex-shrink-0 items-center gap-4'>
          <Icon icon='CustomUSA' size='text-3xl' />
          <Badge
            variant='outline'
            rounded='rounded-full'
            className='border-transparent'>
            1 day ago
          </Badge>
        </div>
      </div>
      <div className='group flex basis-full gap-4'>
        <div className='flex grow items-center'>
          <div>
            <div className='text-xl font-semibold'>
              App
            </div>
            <div className='text-zinc-500'>
              iOS 16.5.1
            </div>
          </div>
          <Button
            className='invisible group-hover:visible'
            color='red'>
            Delete
          </Button>
        </div>
        <div className='flex flex-shrink-0 items-center gap-4'>
          <Icon icon='CustomUSA' size='text-3xl' />
          <Badge
            variant='outline'
            rounded='rounded-full'
            className='border-transparent'>
            3 days ago
          </Badge>
        </div>
      </div>
      <div className='group flex basis-full gap-4'>
        <div className='flex grow items-center'>
          <div>
            <div className='text-xl font-semibold'>
              Safari
            </div>
            <div className='text-zinc-500'>
              iPadOS 16.5.1
            </div>
          </div>
          <Button
            className='invisible group-hover:visible'
            color='red'>
            Delete
          </Button>
        </div>
        <div className='flex flex-shrink-0 items-center gap-4'>
          <Icon icon='CustomUSA' size='text-3xl' />
          <Badge
            variant='outline'
            rounded='rounded-full'
            color='red'
            className='border-transparent'>
            Expired
          </Badge>
        </div>
      </div>
    </div>
  </>
  )
}

export default SessionsComponent
