import React, { Dispatch, FC, SetStateAction } from 'react'
import { useNavigate } from 'react-router-dom'
import Container from '../../../components/layouts/Container/Container'
import Button from '../../../components/ui/Button'
import Icon from '../../../components/icon/Icon'
import Card, { CardBody, CardHeader, CardTitle } from '../../../components/ui/Card'
import { Investment } from '../../../types/app/Inversion.type'
import Badge from '../../../components/ui/Badge'
import { format } from '@formkit/tempo'
import Progress from '../../../components/ui/Progress'
import TimelinePartial from './Timeline.component'

interface InvestmentDetailProps {
  onDetail: Dispatch<SetStateAction<boolean>>
  investment: Investment | null
}

function differenceInDaysCustom(dateLeft: Date, dateRight: Date): number {
  const timeDifference = dateLeft.getTime() - dateRight.getTime();  // Get the difference in milliseconds
  const oneDayInMillis = 1000 * 60 * 60 * 24;  // Number of milliseconds in a day
  return Math.floor(timeDifference / oneDayInMillis);  // Convert milliseconds to days and round down
}


const InvestmentDetail: FC<InvestmentDetailProps> = ({ onDetail, investment }) => {
  const navigate = useNavigate()

  const progressPercentage = investment?.maturityDate
  ? (differenceInDaysCustom(new Date(), new Date(investment.investmentDate)) / differenceInDaysCustom(new Date(investment?.maturityDate), new Date(investment.investmentDate))) * 100
  : 0

  console.log(progressPercentage)
  
  return (
    <Container>
      <div className='flex mb-5'>
        <Button
          icon='HeroArrowLeft' 
          variant='outline'
          color='zinc'
          colorIntensity='400'
          onClick={() => { onDetail(false) }}
        >
          Volver a la lista
        </Button>
      </div>

      <Card className='w-full mb-6 border border-zinc-300 dark:border-zinc-800 '>
        <CardHeader>
          <div className="w-full flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{investment?.investmentType}</CardTitle>
              <span>ID: {investment?.id}</span>
            </div>
            <Badge 
              variant={
                investment?.status === 'Active' ? 'solid' :
                investment?.status === 'Closed' ? 'default' :
                'outline'
              }
              className="text-lg py-1 px-3"
            >
              {investment?.status}
            </Badge>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              {/* <DollarSign className="h-8 w-8 text-green-500 mr-3" /> */}
              {/* <Icon ic */}
              <span className='text-amber-500 text-3xl mr-3'>$</span>
              <div>
                <p className="text-md dark:text-zinc-400 text-zinc-600 text-muted-foreground">Monto Invertido</p>
                <p className="text-2xl font-semibold">
                  {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(investment?.investedAmount!)}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              {/* <Calendar className="h-8 w-8 text-blue-500 mr-3" /> */}
              <Icon icon='HeroCalendar' className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-md dark:text-zinc-400 text-zinc-600 text-muted-foreground">Fecha de Inversión</p>
                <p className="text-2xl font-semibold">
                  {format(new Date(investment?.investmentDate!), { date: 'full' }, 'es' )}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              {/* <TrendingUp className="h-8 w-8 text-purple-500 mr-3" /> */}
              <Icon icon='HeroArrowTrendingUp' className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <p className="text-md dark:text-zinc-400 text-zinc-600 text-muted-foreground">Retorno Esperado</p>
                <p className="text-2xl font-semibold">{investment?.expectedReturn}%</p>
              </div>
            </div>

          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2 border dark:border-zinc-800 border-zinc-300">
          <CardHeader>
            <CardTitle>Detalles de la Inversión</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Progreso de la Inversión</h4>
                <Progress value={progressPercentage} className="w-full" />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>{format(new Date(investment?.investmentDate!), { date: 'medium'}, 'es' )}</span>
                  <span>{investment?.maturityDate ? format(new Date(investment?.maturityDate), { date: 'medium'}, 'es' ) : 'N/A'}</span>
                </div>
              </div>
              <span className='mb-5'/>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Fecha de Vencimiento</h4>
                  <p>{investment?.maturityDate ? format(new Date(investment?.maturityDate), { date: 'full'}, 'es') : 'No especificada'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Duración</h4>
                  <p>{investment?.maturityDate ? `${differenceInDaysCustom(new Date(investment?.maturityDate), new Date(investment?.investmentDate!))} días` : 'No especificada'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Creado</h4>
                  <p>{format(new Date(investment?.createdAt!), { date: 'full'}, 'es')}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Última Actualización</h4>
                  <p>{format(new Date(investment?.updatedAt!), { date: 'full'}, 'es')}</p>
                </div>
              </div>
              <span className='mb-5'/>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Comentarios</h4>
                <p>{investment?.comments || 'Sin comentarios'}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className='border dark:border-zinc-800 border-zinc-300'>
          <CardHeader>
            <CardTitle>Documentos</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {investment?.contract && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Icon icon='HeroClipboardDocument' className='h-4 w-4 mr-2' />
                    <span>Contrato</span>
                  </div>
                  <Button variant="outline" size="sm">
                    <a href={investment?.contract} target="_blank" rel="noopener noreferrer">
                      {/* <FileDown className="h-4 w-4 mr-2" /> */}
                      <Icon icon='HeroDownload' className='h-4 w-4 mr-2' />
                      Ver
                    </a>
                  </Button>
                </div>
              )}
              {investment?.documents && investment?.documents.map(doc => (
                <div key={doc.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    {/* <FileText className="h-5 w-5 text-blue-500 mr-2" /> */}
                    <Icon icon='HeroClipboardDocument' className='h-5 w-5 mr-2' />
                    <span>{doc.description || `Documento ${doc.type}`}</span>
                  </div>
                  <Button variant="outline" size="sm">
                    <a href={doc.url} target="_blank" rel="noopener noreferrer">
                      {/* <FileDown className="h-4 w-4 mr-2" /> */}
                      <Icon icon='HeroDownload' className='h-4 w-4 mr-2' />
                      Ver
                    </a>
                  </Button>
                </div>
              ))}
              {(!investment?.contract && (!investment?.documents || investment.documents.length === 0)) && (
                <p className="text-muted-foreground text-sm">No hay documentos disponibles</p>
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6 border dark:border-zinc-800 border-zinc-200">
        <CardBody>
          <TimelinePartial investment={investment}/>
        </CardBody>
      </Card>
    </Container>
  )
}

export default InvestmentDetail
