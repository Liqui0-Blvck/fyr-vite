import React, { useEffect, useId, useState } from 'react'
import PageWrapper from '../../../components/layouts/PageWrapper/PageWrapper'
import Subheader, { SubheaderLeft, SubheaderRight } from '../../../components/layouts/Subheader/Subheader'
import Container from '../../../components/layouts/Container/Container'
import Card, { CardBody } from '../../../components/ui/Card'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Button from '../../../components/ui/Button'
import { appPages } from '../../../config/pages.config'
import Modal, { ModalBody, ModalFooter, ModalHeader } from '../../../components/ui/Modal'
import Select from '../../../components/form/Select'
import Label from '../../../components/form/Label'
import ProspectButtonsPartial, { ButtonsProspect, TButtons } from './ButtonsProspect'
import PersonalInfo from './PersonalInfo.component'
import NotesComponent from './Notes.component'
import InteractionsList from './InteractionsList.component'
import { useAppDispatch, useAppSelector } from '../../../store/hook'
import { RootState } from '../../../store/rootReducer'
import { transferProspectToClient } from '../../../store/slices/prospect/prospectSlice'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { firestoreService } from '../../../config/firebase.config'
import InvestmentList from './InvestmentList.component'
import Strategies from './Strategies.component'
import toast from 'react-hot-toast'
import Loading from '../../../components/Loading'

const teams = [
  { id: "1", name: "Equipo de Ventas" },
  { id: "2", name: "Equipo de Marketing" },
  { id: "3", name: "Equipo de Soporte" },
]

const users = {
  "1": [
    { id: "1", name: "John Doe", role: "Sales Manager", avatar: "", email: "john@example.com" },
    { id: "2", name: "Jane Smith", role: "Sales Representative", avatar: "", email: "jane@example.com" },
    { id: "3", name: "Mike Johnson", role: "Account Executive", avatar: "", email: "mike@example.com" },
  ],
  "2": [
    { id: "4", name: "Emily Brown", role: "Marketing Manager", avatar: "", email: "emily@example.com" },
    { id: "5", name: "David Lee", role: "Content Specialist", avatar: "", email: "david@example.com" },
  ],
  "3": [
    { id: "6", name: "Sarah Wilson", role: "Support Lead", avatar: "", email: "sarah@example.com" },
    { id: "7", name: "Tom Davis", role: "Technical Support", avatar: "", email: "tom@example.com" },
  ],
}



const DetailProspect = () => {
  const { id } = useParams()
  const label_id = useId()
  const [openModalTransfer, setOpenModalTransfer] = useState<boolean>(false)
  const [selectedTeam, setSelectedTeam] = useState<string | undefined>()
  const [activeButton, setActiveButton] = useState<TButtons>(ButtonsProspect.INFORMACION_PERSONAL)
  const { prospect } = useAppSelector((state: RootState) => state.prospect)
  const { user } = useAppSelector((state: RootState) => state.auth.user)
  const dispatch = useAppDispatch()
  const [loadingTimeOut, setLoadingTimeOut] = useState<boolean>(false)
  const [openModalLoading, setOpenModalLoading] = useState<boolean>(false)
  const [loadingModal, setLoadingModal] = useState<boolean>(false)
  const navigate = useNavigate()
  
  useEffect(() => {
    if (id) {
      const prospectRef = collection(firestoreService, 'prospects');
      const q = query(prospectRef, where('id', '==', id));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        if (!querySnapshot.empty) {
          // Tomar el primer documento y actualizar el estado
          const prospectData = querySnapshot.docs[0].data();
          console.log(prospectData)
          // SET_LEAD(leadData);
        }
      }, (error) => {
        console.error('Error al obtener el prospecto:', error);
      });

      // Limpiar el suscriptor cuando el componente se desmonte
      return () => unsubscribe();
    }
  }, [id]);
  
  const handleTransfer = () => {
    console.log('Transfer')
  }

  const handleCancelTransfer = () => {
    setOpenModalTransfer(false)
    setSelectedTeam(undefined)
  }

  const handleConvertToClient = () => {
    setLoadingTimeOut(true)
    setLoadingModal(true)
    const timeOut = setTimeout(() => {
      dispatch(transferProspectToClient({ prospectID: id!, userID: user?.uid!})).unwrap()
      toast.success('Prospecto convertido a cliente')
      navigate(`/client/${id}`)
      setLoadingModal(true)
    }, 3000)

    setLoadingTimeOut(false)
    return () => clearTimeout(timeOut)
  }

  return (
    <PageWrapper title='Detalle Prospecto'>
      <Subheader>
        <SubheaderLeft>
          <Link
              to={`../${appPages.prospectPage.to}`}>
              <Button icon='HeroArrowLeft' className='!px-0'>
                Volver a la lista
              </Button>
					</Link>
        </SubheaderLeft>
        <SubheaderRight>

          <Button
            icon='HeroUserPlus'
            className='!px-0'
            color='blue'
            onClick={() => {
              setOpenModalLoading(true)
            }}
            >
            Convertir a Cliente
          </Button>

          <Button
            icon='HeroArrowRight'
            className='!px-0'
            color='emerald'
            onClick={() => setOpenModalTransfer(!openModalTransfer)}
          >
            Transferir
          </Button>


          <Button
            icon='HeroArchiveBox'
            className='!px-0'
            color='red'
            >
            Archivar
          </Button>

        </SubheaderRight>
      </Subheader>
      <Subheader>
        <ProspectButtonsPartial activeTab={activeButton!} setActiveTab={setActiveButton} />
      </Subheader>
      <Container>
        {
          openModalLoading && (
            <Modal
              isOpen={openModalLoading}
              setIsOpen={setOpenModalLoading}            
            >
              <ModalHeader className='px-10'>
                <span>Convertir a Cliente</span>
              </ModalHeader>
              <ModalBody>
               {
                loadingModal 
                  ? (
                    <>
                      <p className='text-center'>
                        Convirtiendo prospecto a cliente...
                      </p>
                      <Loading className='h-20 w-full flex items-center justify-center'/>
                    </>
                    )
                  : (
                    <div className='flex flex-col gap-8 px-6'>
                      <p className='text-center'>
                        ¿Estás seguro de convertir a este prospecto en cliente?
                      </p>
                    </div>
                  )
               }
              </ModalBody>
              <ModalFooter>
                <Button
                  variant='outline'
                  color='red'
                  onClick={() => setOpenModalLoading(false)}
                  >
                  Cancelar
                </Button>
                <Button
                  variant='solid'
                  onClick={handleConvertToClient}
                  >
                  Convertir
                </Button>
              </ModalFooter>
            </Modal>
          )
        }
        {
          openModalTransfer && (
            <Modal
              size='sm'
              isOpen={openModalTransfer}
              setIsOpen={setOpenModalTransfer}
              
              >
                <ModalHeader className='px-10'>
                  <span>Transferir Prospecto</span>
                </ModalHeader>
                <ModalBody>
                  <div className='flex flex-col gap-8 px-6'>
                    <section className='w-full'>
                      <Label id={label_id} htmlFor={label_id}>Selecciona Equipo</Label>
                      <Select
                        onChange={(e) => setSelectedTeam(e.target.value)}
                        id={label_id}
                        name={label_id}
                        placeholder='Elige un equipo'
                        >
                        {
                          teams.map((team) => (
                            <option key={team.id} value={team.id}>{team.name}</option>
                          ))
                        }
                      </Select>
                      {

                      }
                    </section>

                    {
                      selectedTeam && (
                        <section className='w-full'>
                          <Label id={label_id} htmlFor={label_id}>Selecciona Usuario</Label>
                          <ul 
                            className='border border-zinc-200 
                            rounded-md p-4 flex flex-col gap-3 
                            dark:bg-zinc-800
                            dark:border-zinc-700
                            bg-zinc-100
                            '>
                            {
                              // @ts-ignore
                              users[selectedTeam].map((user) => (
                                <li
                                  key={user.id} 
                                  className='flex items-center gap-5 
                                  dark:bg-zinc-950 
                                  dark:hover:bg-zinc-900
                                  bg-zinc-300
                                  hover:bg-zinc-200
                                  p-2 rounded-md cursor-pointer'
                                  onClick={() => console.log('User selected')}
                                  
                                  >
                                  {
                                    user.avatar
                                      ? (
                                        <img 
                                          src={user.avatar} 
                                          alt={user.name} 
                                          className='w-10 h-10 rounded-full' 
                                        />
                                      )
                                      : (
                                        <div className='w-10 h-10 bg-gray-500 rounded-full' />
                                      )
                                  }
                                  <div>
                                    <span>{user.name}</span>
                                    <span>{user.role}</span>
                                  </div>
                                </li>
                              ))
                            }
                          </ul>

                        </section>
                      )
                    }

                  </div>
                </ModalBody>
                <ModalFooter className='mt-10'>
                  <Button
                    variant='outline'
                    color='red'
                    onClick={handleCancelTransfer}
                    >
                    Cancelar
                  </Button>
                  <Button
                    variant='outline'
                    onClick={handleTransfer}
                    >
                    Transferir
                  </Button>
                </ModalFooter>
            </Modal>
          )
        }


        <Card>
          <CardBody>
            {
              activeButton?.text === 'Información Personal' && (
                <PersonalInfo />
              )
            }
            {
              activeButton?.text === 'Notas' && (
                <NotesComponent />
              )
            }
            {
              activeButton?.text === 'Interacciones' && (
                <InteractionsList />
              )
            }
            {
              prospect?.status === 'interesado' && (
                <>
                  {
                    activeButton?.text === 'Inversiones' && (
                      <InvestmentList />
                    )
                  }
                  {
                    activeButton?.text === 'Estrategias' && (
                     <Strategies />
                    )
                  }
                </>
              )
            }
          </CardBody>
        </Card>
      </Container>
    </PageWrapper>
  )
}

export default DetailProspect
