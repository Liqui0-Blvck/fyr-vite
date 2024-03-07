import { useEffect, useState } from "react";
import {useAxiosFunction} from "../../hooks/useAxiosFunction";

interface userData {
  username: string;
  email: string;
  password: string;
}

const useUserAPI = () => {
  const [userData, setUserData] = useState(null) 
  const { response: df, axiosFetch } = useAxiosFunction();


  const getCheckUser = (userNameOrMail: string, password: string) => {
    const body = JSON.stringify({username: userNameOrMail, password: password})
  };

  return { df, getCheckUser };
};

export default useUserAPI;
