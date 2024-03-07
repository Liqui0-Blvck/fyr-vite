import { useState } from 'react';
import Cookies from 'js-cookie';

// Define el tipo para la función 'setValue'
type SetValueFunction<T> = (newValue: T) => Promise<boolean>;

// Define la interfaz para el hook
interface IUseCookieStorage<T> {
  storedValue: T | null;
  setValue: SetValueFunction<T>;
}

// Define el hook 'useCookieStorage'
const useCookieStorage = <T>(keyName: string): IUseCookieStorage<T> => {
  // Intenta recuperar el valor de los cookies con la clave 'keyName'
  const storedValueJSON = Cookies.get(keyName);
  const storedValue: T | null = storedValueJSON ? JSON.parse(storedValueJSON) : null;

  // Utiliza el hook useState para inicializar el estado 'storedValue' con el valor recuperado de los cookies
  const [stored, setStoredValue] = useState<T | null>(storedValue);

  // Define la función 'setValue' que actualiza el valor de los cookies con el nuevo valor proporcionado
  const setValue: SetValueFunction<T> = (newValue) => {
    return new Promise((resolve) => {
      try {
        // Guarda el nuevo valor en los cookies con la clave 'keyName'
        Cookies.set(keyName, JSON.stringify(newValue));
        // Resuelve la promesa con verdadero (éxito)
        resolve(true);
      } catch (err) {
        // Si hay un error, puedes manejarlo aquí si es necesario
        // Por ejemplo, puedes enviar el error a un servicio de registro de errores
        console.error('Error setting cookie value:', err);
        // Resuelve la promesa con falso (fracaso)
        resolve(false);
      }
      // Actualiza el estado local con el nuevo valor
      setStoredValue(newValue);
    });
  };

  // Devuelve el estado almacenado y la función para establecer el valor
  return { storedValue: stored, setValue };
};

export default useCookieStorage;