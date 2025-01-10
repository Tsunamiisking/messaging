import { useState ,useEffect } from "react";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";

// MY ATTEMPT
// const authStateChange = () => {
//     useEffect(() => {
//         onAuthStateChanged(auth, (user) => user)
//     }, auth)
// }

// export {authStateChange}

// ALREDY DEVISED ATTEMPT

export const authStateChange = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
};