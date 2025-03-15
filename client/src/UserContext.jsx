import { createContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
export const Usercontext = createContext({});
export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!user) {
      axios
        .get("http://localhost:4000/profile", { withCredentials: true })
        .then(({ data }) => {
          setUser(data);
          setReady(true);
        });
    }
  }, []);
  return (
    <Usercontext.Provider value={{ user, setUser, ready, setReady }}>
      {children}
    </Usercontext.Provider>
  );
}
