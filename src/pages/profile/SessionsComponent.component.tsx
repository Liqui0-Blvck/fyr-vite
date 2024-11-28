import React, { useEffect } from 'react'
import Icon from '../../components/icon/Icon'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { useAppDispatch, useAppSelector } from '../../store/hook'
import { RootState } from '../../store/rootReducer'
import { fetchUserLogs } from '../../store/slices/auth/userSlice'
import { getAuth } from 'firebase/auth'



const SessionsComponent = () => {
  const { sessions } = useAppSelector((state: RootState) => state.auth.user)
  const dispatch = useAppDispatch()
  const user = getAuth().currentUser

  useEffect(() => {
    if (user) {
      dispatch(fetchUserLogs(user?.uid!))
    }
  }, [])




  return (
  <>
    <div className='text-4xl font-semibold'>Sesiones</div>
    <div className='flex flex-wrap divide-y divide-dashed divide-zinc-500/50 [&>*]:py-4'>
      
        {
          sessions.map((session) => {
            
            const loginTime = new Date(session.timestamp);
            const currentTime = new Date();
            const timeDifference = currentTime.getTime() - loginTime.getTime();
            const timeInSeconds = Math.floor(timeDifference / 1000);
            const timeInMinutes = Math.floor(timeInSeconds / 60);

            return (
              <div key={session.id} className='group flex basis-full gap-4'>
                <div className='flex grow items-center'>
                  <div>
                    <div className='text-xl font-semibold'>
                      {session.device.browser}
                    </div>
                    <div className='text-zinc-500'>
                      {session.device.os} {session.device.osVersion}
                    </div>
                  </div>
                  {/* <Button
                    className='invisible group-hover:visible'
                    color='red'>
                    Delete
                  </Button> */}
                </div>
                <div className='flex flex-shrink-0 items-center gap-4'>
                  <Icon icon='CustomUSA' size='text-3xl' />
                  <Badge
                    variant='outline'
                    rounded='rounded-full'
                    className='border-transparent'>
                    {timeInMinutes} minutos atras
                  </Badge>
                </div>
              </div>
            )
          })
        }
    </div>
  </>
  )
}

export default SessionsComponent
