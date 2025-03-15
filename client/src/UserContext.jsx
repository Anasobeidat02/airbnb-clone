import { createContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
export const Usercontext = createContext({});
export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  useEffect(() => { 
    if(!user){
      axios.get("/profile") // ارسال طلب للسيرفر لجلب بيانات المستخدم
    }
  }, []);
  return (
    <Usercontext.Provider value={{ user, setUser }}>
      {children}
    </Usercontext.Provider>
  );
}
