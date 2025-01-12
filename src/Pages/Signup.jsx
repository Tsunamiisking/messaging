import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { firestore, auth } from "../firebase/config";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { setDoc, doc } from "firebase/firestore";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();
//   const [CreateUserWithEmailAndPassword, authUser, loading, error] =
//     useCreateUserWithEmailAndPassword(auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
        console.log("User Creation Response:", res);

      if (res.user) {
        await setDoc(doc(firestore, "Users", res.user.uid), {
          username,
          uid: res.user.uid,
          email: email,
          createdAt: new Date(),
        });
        navigate("/users");
        setEmail("");
        setPassword("");
        // authUser.displayname = username
      }
    } catch (e) {
      console.error("Firestore Error:", e.message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <form action="" onSubmit={handleSubmit} className="space-y-6">
          <h1 className="font-bold text-xl text-center my-10 ">Sign Up</h1>
          <div className="space-y-4">
            <input
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              name="name"
              id="name"
              value={username}
              placeholder="Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              name="email"
              id="email"
              value={email}
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={password}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Signup;
