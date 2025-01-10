import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { firestore } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
// import { checkIfEmailExists } from "../util/db";
import { getAuth } from "firebase/auth";
import '../output.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const auth = getAuth()


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      console.log(res);
  
      setEmail("");
      setPassword("");
      navigate("/users")
    } catch (e) {
      console.error("error", e?.code); 
    }
  };
  
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
      <form action="" onSubmit={handleSubmit} className="space-y-6">
      <h1 className="font-bold text-xl text-center my-10 ">Login</h1>
        <div className="space-y-4">
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
         <div className="mt-2">
         <a href="/signup"><span className=" text-blue-500">sign up instead</span></a>
         </div>
        </div>
      </form>
    </div>
  </main>
  
  );
};

export default Login;
