import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAppDispatch } from "../store/hook";
import { clearUser, fetchUser } from "../store/slices/auth/userSlice"; // Si usas `fetchUser` para obtener datos

const useAuthStateSync = () => {
  const dispatch = useAppDispatch();

  // Estado de carga
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
  
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Obtén los datos del usuario desde el backend si es necesario
          await dispatch(fetchUser(user?.uid || null)).unwrap();
          setIsLoading(false); // Termina la carga si los datos se obtuvieron con éxito
        } catch (error) {
          console.error("Error al obtener el usuario", error);
          setIsLoading(false); // Asegúrate de finalizar la carga incluso si ocurre un error
        }
      } else {
        // Si el usuario no está autenticado, eliminarlo del estado global
        dispatch(clearUser());
        setIsLoading(false); // Finalizar carga
      }
    });
  
    return () => unsubscribe(); // Cleanup al desmontar
  }, [dispatch]);
  
  
  return { isLoading };
};

export default useAuthStateSync;
