import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAppDispatch } from "../store";
import { clearUser, fetchUser } from "../store/slices/auth/authSlices"; // Si usas `fetchUser` para obtener datos

const useAuthStateSync = () => {
  const dispatch = useAppDispatch();

  // Estado de carga
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Obtener los datos del usuario usando un thunk
          await dispatch(fetchUser(user?.uid || null)).unwrap();
          setIsLoading(false); // Cuando los datos estén cargados, cambia el estado de carga
        } catch (error) {
          console.error("Error al obtener el usuario", error);
          setIsLoading(false); // Asegúrate de finalizar la carga incluso si ocurre un error
        }
      } else {
        // Eliminar el usuario de Redux si no está autenticado
        dispatch(clearUser());
        setIsLoading(false); // Finalizar carga
      }
    });

    return () => unsubscribe(); // Cleanup al desmontar
  }, [dispatch]);

  return { isLoading };
};

export default useAuthStateSync;
