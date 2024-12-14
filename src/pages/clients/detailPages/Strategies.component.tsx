import React from 'react'
import PageWrapper from '../../../components/layouts/PageWrapper/PageWrapper'
import Card, { CardBody, CardFooter, CardHeader } from '../../../components/ui/Card'
import Container from '../../../components/layouts/Container/Container'
import Input from '../../../components/form/Input'
import Select from '../../../components/form/Select'
import { investmentStrategies } from '../../../mocks/Data'
import Badge from '../../../components/ui/Badge'
import { format } from '@formkit/tempo'
import Button from '../../../components/ui/Button'
import StrategiesList from './StrategiesList.component'
import Modal, { ModalBody, ModalHeader } from '../../../components/ui/Modal'
import StrategiesForm from '../components/strategiesForm.form'

const Strategies = () => {
  const [openModalForm, setOpenModalForm] = React.useState(false)


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
            <StrategiesForm />
          </ModalBody>
        </Modal>
      )
    }
    <PageWrapper title='Estrategias'>
      <Container>
        <Card>
          <CardHeader>
              <div className='flex flex-col'>
                  <h2 className='text-zinc-400'>Estrategias de Inversión</h2>
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
                <option value=''>Tipo de Estrategia</option>
                <option value=''>Estrategia 1</option>
                <option value=''>Estrategia 2</option>
                <option value=''>Estrategia 3</option>
              </Select>
              <Select
                name='risk'
                id='risk'
                className='w-1/4'

                >
                <option value=''>Rentabilidad</option>
                <option value=''>Menos del 5%</option>
                <option value=''>5% - 10%</option>
                <option value=''>Más del 10%</option>
              </Select>
              <Select
                name='status'
                id='status'
                className='w-1/4'
              >
                <option value=''>Estado</option>
                <option value=''>Activa</option>
                <option value=''>Inactiva</option>
              </Select>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
              {
                investmentStrategies.map((strategy) => (
                  <Card className='shadow-lg rounded-md border dark:border-zinc-800 p-2'>
                    <CardHeader>
                      <div className='flex flex-col items-start gap-3'>
                        <h2>{strategy.name}</h2>
                        <Badge 
                          variant='solid'
                          color={
                          strategy.risk === 'Low' ? 'emerald' :
                          strategy.risk === 'Medium' ? 'amber' :
                          strategy.risk === 'High' ? 'red' : 'zinc'
                        }>
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
                        <span className='text-lg'>Creada el: {format(strategy.creationDate, { date: 'short' }, 'es' )}</span>
                      </div>

                      <div className='my-2'>
                        <span className='text-lg'>Estado: {strategy.status}</span>
                      </div>
                    </CardBody>
                    <CardFooter className='mt-5'>
                      <Button 
                        variant='solid'
                        
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
    </>
  )
}

export default Strategies
