import { createContext, useState } from "react";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
  const backend = import.meta.env.VITE_BACKEND_URL
  const [isLoggedIn , setisLoggedIn] = useState(false)
  const [userData, setuserData] = useState('xxx')
  const value = {
    backend,
    isLoggedIn,
    userData,
    setisLoggedIn,
    setuserData,
  }
  return (
    <AppContent.Provider value={value}>
    {props.children}
    </AppContent.Provider>
  )
}





