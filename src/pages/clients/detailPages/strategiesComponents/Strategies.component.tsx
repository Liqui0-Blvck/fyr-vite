import { useEffect, useState } from 'react'
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper'
import Card, { CardBody, CardFooter, CardHeader } from '../../../../components/ui/Card'
import Container from '../../../../components/layouts/Container/Container'
import Input from '../../../../components/form/Input'
import Select from '../../../../components/form/Select'
import Badge from '../../../../components/ui/Badge'
import { format } from '@formkit/tempo'
import Button from '../../../../components/ui/Button'
import StrategiesList from './StrategiesList.component'
import Modal, { ModalBody, ModalHeader } from '../../../../components/ui/Modal'
import { useAppDispatch, useAppSelector } from '../../../../store/hook'
import { RootState } from '../../../../store/rootReducer'
import { getStrategiesByUser } from '../../../../store/slices/clients/clientSlice'
import { Strategy } from '../../../../types/app/Strategies.type'
import StrategyDetail from './StrategyDetail.component'
import StrategiesForm from '../../components/StrategiesForm.form'
import StrategyFormIA from '../../components/StrategiesFormIA'

const strategiesTypes = [
  { value: 'Conservador', label: 'Conservador' },
  { value: 'Moderado', label: 'Moderado' },
  { value: 'Agresivo', label: 'Agresivo' },
]

const riskTypes = [
  { value: 'Menos del 5%', label: 'Menos del 5%' },
  { value: '5% - 10%', label: '5% - 10%' },
  { value: 'Más del 10%', label: 'Más del 10%' },
]

const statusTypes = [
  { value: 'Activo', label: 'Activo' },
  { value: 'Pausado', label: 'Pausado' },
  { value: 'Inactivo', label: 'Inactivo' },
]

const Strategies = () => {
  const [openModalForm, setOpenModalForm] = useState(false)
  const { strategies } = useAppSelector((state: RootState) => state.client)
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state: RootState) => state.auth.user)

  const [openDetail, setOpenDetail] = useState(false)
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null)
  const [selectedFormStrategy, setSelectedFormStrategy] = useState<string>('')

  useEffect(() => {
    dispatch(getStrategiesByUser(user?.uid!))
  }, [])


  return (
    <>
    {
      openModalForm && (
        <Modal
          isOpen={openModalForm}
          setIsOpen={setOpenModalForm}
          >
          <ModalHeader>
            <div className='p-5'>
              <h3>Crear nueva estrategia</h3>
              <p className='text-base dark:text-zinc-500 text-zinc-400'>Complete los detalles de su nueva estrategia de inversión aquí.</p>
            </div>
          </ModalHeader>
          <ModalBody>
            
            {
              !selectedFormStrategy
                ? (
                  <div className='w-full flex flex-col gap-10'>
                    <Button
                      variant='outline'
                      className='w-full'
                      size='lg'
                      onClick={() => setSelectedFormStrategy('Normal')}
                      >
                      Formulario Estrategia Normal 
                    </Button>

                    <Button
                      variant='outline'
                      className='w-full'
                      size='lg'
                      onClick={() => setSelectedFormStrategy('IA')}
                      >
                      Formulario Estrategia IA 
                    </Button>
                  </div>
                )
                : null
            }

            {
              selectedFormStrategy === 'Normal'
                ? <StrategiesForm isClosed={setOpenModalForm}/>
                : selectedFormStrategy === 'IA'
                  ? <StrategyFormIA />
                  : null
            
            }
          </ModalBody>
        </Modal>
      )
    }

    {
      openDetail 
        ? (
          <>
            <StrategyDetail strategy={selectedStrategy} isClosed={setOpenDetail}/>
          </>
        )
        : (
          <PageWrapper title='Estrategias'>
            <Container breakpoint='2xl:container' className='w-full'>
              <Card>
                <CardHeader>
                    <div className='flex flex-col'>
                        <h2 className='text-zinc-800'>Estrategias de Inversión</h2>
                        <span className='text-md text-zinc-500'>Explora las mejores estrategias adaptadas a tus objetivos financieros.</span>
                    </div>
                </CardHeader>
                <CardBody>
                  <section className='w-full flex gap-5 flex-wrap lg:flex-nowrap'>
                    <Input
                      type='text'
                      placeholder='Buscar Estrategias... '
                      name='search'
                      className='w-full'
                    />
                    <Select
                      name='type'
                      id='type'
                      className='w-1/4'
                    >
                      {strategiesTypes.map((type) => {
                        return <option value={type.value}>{type.label}</option>
                      })}
                    </Select>
                    <Select
                      name='risk'
                      id='risk'
                      className='w-1/4'

                      >
                      { riskTypes.map((type) => {
                        return <option value={type.value}>{type.label}</option>
                      })}
                    </Select>
                    <Select
                      name='status'
                      id='status'
                      className='w-1/4'
                    >
                      { statusTypes.map((type) => {
                        return <option value={type.value}>{type.label}</option>
                      })}
                    </Select>
                  </section>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
                    {
                    [...strategies]  // Crea una copia del array para evitar modificar el original
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // Ordenar por fecha de creación de más reciente a más antiguo
                      .slice(0, 4) // Obtener solo los 4 últimos
                      .map((strategy) => (
                        <Card key={strategy.id} className='shadow-lg rounded-md border dark:border-zinc-800 p-2'>
                          <CardHeader>
                            <div className='flex flex-col items-start gap-3'>
                              <h2>{strategy.name}</h2>
                              <Badge
                                variant='solid'
                                color={
                                  strategy.risk === 'Bajo'
                                    ? 'emerald'
                                    : strategy.risk === 'Medio'
                                    ? 'amber'
                                    : strategy.risk === 'Alto'
                                    ? 'red'
                                    : 'zinc'
                                }
                              >
                                {strategy.risk}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardBody>
                            <div className='flex gap-2 '>
                              <span className='text-3xl text-emerald-400'>{strategy.expectedReturn}%</span>
                              <p className='text-lg '>anual est.</p>
                            </div>

                            <div className='my-2'>
                              <span className='text-lg'>
                                Creada el: {format(strategy.createdAt, { date: 'short' }, 'es')}
                              </span>
                            </div>

                            <div className='my-2'>
                              <span className='text-lg'>Estado: {strategy.status}</span>
                            </div>
                          </CardBody>
                          <CardFooter className='mt-5'>
                            <Button
                              variant='solid'
                              onClick={() => {
                                setOpenDetail(true)
                                setSelectedStrategy(strategy)
                              }}
                            >
                              Ver Detalles
                            </Button>
                          </CardFooter>
                        </Card>
                      ))
                  }


                  </div>
                </CardBody>
              </Card>

              <div className='flex mt-5 gap-10 justify-center'>
                <Button
                  variant='outline'
                  onClick={() => {
                    setOpenModalForm(true)

                  }}
                  >
                  Crear nueva estrategias
                </Button>

                <Button
                  variant='solid'
                  >
                  Aplicar estrategias seleccionadas
                </Button>
              </div>

              <div className='mt-10'>
                <StrategiesList />
              </div>
            </Container>
          </PageWrapper>
        )
    }
    
    </>
  )
}

export default Strategies
