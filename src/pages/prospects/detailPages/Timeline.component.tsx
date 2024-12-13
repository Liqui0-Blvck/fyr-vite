import React, { FC } from 'react';
import Card, {
  CardBody,
  CardHeader,
  CardHeaderChild,
  CardTitle,
} from '../../../components/ui/Card';
import Timeline, { TimelineItem } from '../../../components/Timeline';
import { Investment } from 'src/types/app/Inversion.type';

interface TimelinePartialProps {
  investment: Investment | null;
}

const TimelinePartial: FC<TimelinePartialProps> = ({ investment }) => {
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardHeaderChild>
          <CardTitle>Línea de Tiempo</CardTitle>
        </CardHeaderChild>
      </CardHeader>
      <CardBody className={`${investment?.timeline ? 'h-96 overflow-scroll' : ''}`}>
        {/* Verificar si la inversión tiene una timeline */}
        {investment?.timeline && investment.timeline.length > 0 ? (
          // Si hay timeline, mapeamos los eventos
          <Timeline>
            {investment.timeline.map((item, index) => (
              <TimelineItem key={index} icon='HeroRocketLaunch'>
                {item.description}
              </TimelineItem>
            ))}
          </Timeline>
        ) : (
          // Si no hay timeline, mostramos el mensaje
          <h3 className="text-center">
            No hay eventos en la línea de tiempo.
          </h3>
        )}
      </CardBody>
    </Card>
  );
};

export default TimelinePartial;
