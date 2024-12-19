import { TIcons } from '../../../../types/icons.type';

// Tipo para la data de una columna en el kanban
export type TColumnData = {
  id: string;
  title: string;
  icon: TIcons;
  order: number;
};

// Mapeo de columnas por ID
type TColumnsData = {
  [key: string]: TColumnData;
};

export default TColumnsData;
