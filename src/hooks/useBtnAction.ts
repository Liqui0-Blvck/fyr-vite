import { useState } from "react";

const useBtnAction = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (callback: () => Promise<void> | void) => {
    if (isSubmitting) return; // Evitar doble clic
    setIsSubmitting(true); // Desactiva el botón al iniciar el submit

    try {
      await Promise.resolve(callback()); // Ejecuta el callback pasado
    } catch (error) {
      console.error("Error en el submit:", error);
    } finally {
      setIsSubmitting(false); // Reactiva el botón después de finalizar
    }
  };

  return { isSubmitting, handleSubmit };
};

export default useBtnAction;
