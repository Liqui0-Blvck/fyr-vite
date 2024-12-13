import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card, { CardBody } from '../../components/ui/Card';
import Input from '../../components/form/Input';
import Button from '../../components/ui/Button';
import { Lead } from '../../types/app/Prospect.type';
import Select from '../../components/form/Select';

interface FilterCardProps {
  onFilter: (filters: Partial<Lead>) => void;
}

const FilterCard: React.FC<FilterCardProps> = ({ onFilter }) => {
  const [estado, setEstado] = useState<string>('');
  const [fuente, setFuente] = useState<string>('');
  const [fechaCreacion, setFechaCreacion] = useState<string>('');
  const [fechaUltimaInteraccion, setFechaUltimaInteraccion] = useState<string>('');

  // Manejar el cambio de los filtros
  const handleFilterChange = () => {
    onFilter({
      estado,
      fuente,
      fechaCreacion,
      fechaUltimaInteraccion,
    });
  };


  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }} 
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="left-0 top-0 "
    >
      <Card className="w-[220px] bg-white p-4 rounded-lg shadow-lg">
        <CardBody>
          <h2 className="text-xl font-semibold mb-4 text-center">Filtros de Prospectos</h2>
          
          {/* Filtro por Estado */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Estado</label>
            <Select
              name='estado'
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3"
            >
              <option value="">Selecciona un estado</option>
              <option value="interesado">Interesado</option>
              <option value="esperando">Esperando</option>
              <option value="no-interesado">No Interesado</option>
            </Select>
          </div>

          {/* Filtro por Fuente */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Fuente</label>
            <Select
              name='fuente'
              value={fuente}
              onChange={(e) => setFuente(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3"
            >
              <option value="">Selecciona una fuente</option>
              <option value="publicidad">Publicidad</option>
              <option value="referencia">Referencia</option>
              <option value="web">Web</option>
            </Select>
          </div>

          {/* Filtro por Fecha de Creación */}
          <div className="mb-4">
            <label htmlFor='fecha_creacion' className="block text-sm font-medium mb-2">Fecha de Creación</label>
            <Input
              name='fecha_creacion'
              type="date"
              value={fechaCreacion}
              onChange={(e) => setFechaCreacion(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3"
            />
          </div>

          {/* Filtro por Última Interacción */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Última Interacción</label>
            <Input
              name='date'
              type="date"
              value={fechaUltimaInteraccion}
              onChange={(e) => setFechaUltimaInteraccion(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3"
            />
          </div>

          {/* Botón de aplicar filtros */}
          <Button
            variant="solid"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md"
            onClick={handleFilterChange}
          >
            Aplicar Filtros
          </Button>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default FilterCard;
