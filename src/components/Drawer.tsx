import React, { FC, Dispatch, SetStateAction } from 'react';

interface DrawerProps {
  isOpen: boolean;  // Estado de apertura/cierre
  setIsOpen: Dispatch<SetStateAction<boolean>>;  // Función para cambiar el estado
  title: string;  // Título del Drawer
  children: React.ReactNode;  // Contenido del Drawer
}

const Drawer: FC<DrawerProps> = ({ isOpen, setIsOpen, title, children }) => {
  return (
    <>
      {/* Fondo oscuro que cubre la pantalla cuando el Drawer está abierto */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}  // Permite cerrar al hacer clic fuera del Drawer
      ></div>

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 bg-white w-80 h-full shadow-lg transition-transform transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header del Drawer */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            className="text-gray-500"
            onClick={() => setIsOpen(false)}  // Cierra el Drawer
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Contenido del Drawer */}
        <div className="p-4 overflow-auto">
          {children}
        </div>
      </div>
    </>
  );
};

export default Drawer;
