import React, { Dispatch, FC, SetStateAction, useState } from 'react'
import Card, { CardBody, CardHeader } from '../../../../components/ui/Card'
import Button from '../../../../components/ui/Button'
import { Strategy } from '../../../../types/app/Strategies.type'
import Loading from '../../../../components/Loading'
import { format } from '@formkit/tempo'

interface StrategyDetailProps {
  strategy: Strategy | null
  isClosed: Dispatch<SetStateAction<boolean>>
}

function generateAIResponse(strategy: Strategy, _input: string) {
  // Simulación de respuestas de IA basadas en la estrategia y la entrada del usuario
  const responses = [
    `Basado en la estrategia ${strategy.name}, te recomiendo considerar invertir en ${strategy.type === 'Conservador' ? 'bonos gubernamentales' : strategy.type === 'Moderado' ? 'una mezcla de acciones y bonos' : 'acciones de alto crecimiento'}.`,
    `Con un retorno esperado del ${strategy.expectedReturn}%, esta estrategia se alinea con un perfil de riesgo ${strategy.risk.toLowerCase()}. Asegúrate de que esto coincida con tus objetivos financieros.`,
    `Dada la naturaleza ${strategy.type.toLowerCase()} de esta estrategia, considera un horizonte de inversión de ${strategy.type === 'Conservador' ? '1-3' : strategy.type === 'Moderado' ? '3-7' : '7+'} años para obtener los mejores resultados.`,
    `Para diversificar aún más, podrías considerar añadir ${strategy.type === 'Conservador' ? 'algunos fondos de mercado monetario' : strategy.type === 'Moderado' ? 'ETFs de diferentes sectores' : 'algunas acciones internacionales de mercados emergentes'} a tu cartera.`
  ]
  return responses[Math.floor(Math.random() * responses.length)]
}

function AIChat({ strategy, isOpen, onClose }: { strategy: Strategy, isOpen: boolean, onClose: () => void }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hola, soy tu asistente de IA para la estrategia "${strategy.name}". ¿En qué puedo ayudarte?` }
  ])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (input.trim() === '') return

    setMessages([...messages, { role: 'user', content: input }])
    setInput('')

    // Simular respuesta de la IA
    setTimeout(() => {
      const aiResponse = generateAIResponse(strategy, input)
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }])
    }, 1000)
  }

  return (
    <div className="flex flex-col justify-between">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-lg font-semibold">Chat con IA</h3>
      </div>
      <div className="flex flex-col justify-between h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]"> {/* Ajustada la altura máxima y overflow */}
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-zinc-950'}`}>
                {message.content}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Escribe tu mensaje..."
              className="flex-1 px-3 py-2 border rounded-md"
            />
            <Button
              variant='solid' 
              onClick={handleSend}>Enviar</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

const StrategyDetail: FC<StrategyDetailProps> = ({ strategy, isClosed }) => {
  const [openRigthPanel, setOpenRigthPanel] = useState<boolean>(false)

  if (!strategy) {
    return <Loading />
  }

  return (
    <Card>
      <CardHeader>
        <div className='px-3 w-full flex justify-between items-end'>
          <Button
            onClick={() => isClosed(false)}
            variant='outline'
            color='zinc'
            colorIntensity='400'
            icon='HeroArrowLeft'>
            Volver a la lista
          </Button>

          {/* <Button
            variant='solid'
            icon='HeroChatBubbleLeftRight'
            onClick={() => setOpenRigthPanel(!openRigthPanel)}
            >
            Chat
          </Button> */}
        </div>
      </CardHeader>
      <CardBody>
        <div className='flex gap-5 p-2'>
          <span className='w-full flex flex-col gap-5'>
            <div className='flex flex-col md:flex-row lg:flex-row xl:flex-row w-full border dark:border-zinc-800 border-zinc-200 rounded-md p-4'>
              <div className='flex flex-col md:flex-row lg:flex-row xl:flex-row w-full gap-5'>
                <div className='w-full p-2 '>
                  <span className='text-md dark:text-zinc-400 text-zinc-400'>Nombre</span>
                  <p className='text-xl mt-2'>{strategy.name}</p>
                  
                </div>
                <div className='w-full p-2'>
                  <span className='text-md dark:text-zinc-400 text-zinc-400'>Fecha Creación</span>
                  <p className='text-xl mt-2'>{format(strategy.createdAt, { date: 'full' }, 'es' )}</p>
                </div>
                <div className='w-full p-2'>
                  <span className='text-md dark:text-zinc-400 text-zinc-400'>Rentabilidad Esperada</span>
                  <p className='text-xl mt-2'>{strategy.expectedReturn}</p>
                </div>
              </div>
            </div>

            <span className='flex flex-col md:flex-row lg:flex-row xl:flex-row w-full gap-5'>
              <div className='flex w-full h-72 gap-5 border dark:border-zinc-800 border-zinc-200 rounded-md p-4'>
                <div className='flex flex-wrap w-full p-2'>
                  <div className='w-6/12'>
                    <h3>Riesgo</h3>
                    <p>{strategy.risk}</p>
                  </div>

                  <div className='w-6/12'>
                    <h3>Estado</h3>
                    <p>{strategy.status}</p>
                  </div>

                  <div className='w-6/12'>
                    <h3>Tipo</h3>
                    <p>{strategy.type}</p>
                  </div>

                  <div className='w-6/12'>
                    <h3>Fecha de actualización</h3>
                    <p>{format(strategy.updatedAt, { date: 'full' }, 'es' )}</p>
                  </div>


                </div>
              </div>
              <div className='w-5/12 border dark:border-zinc-800 border-zinc-200 rounded-md  p-4'>
                <h3>Descripción</h3>
                <p>{strategy.description}</p>
              </div>

            </span>

          </span>

          {
            openRigthPanel && (
              <span className='w-[500px] dark:bg-zinc-950 bg-zinc-100 border dark:border-zinc-800 border-zinc-40 rounded-md'>
                  <AIChat strategy={strategy} isOpen={openRigthPanel} onClose={() => setOpenRigthPanel(false)} />
              </span>
            )
          }
        </div>
      </CardBody>
    </Card>
  )
}

export default StrategyDetail
