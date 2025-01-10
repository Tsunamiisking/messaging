import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import "../index.css";
import { useNavigate } from "react-router-dom";
import { authStateChange } from "../util/auth";
import { allUsersFromFirestore } from "../util/db";
import { initiateConversation } from "../util/db";
import { serverTimestamp } from "firebase/firestore";

const Users = () => {
  const navigate = useNavigate();
  const [convoID, setConvoID] = useState(null);
  const [message, setMessage] = useState(null);
  const { user, loading } = authStateChange();
  const { SelectedRecipientID, setSelectedRecipientID } = useState(null);
  const [allUsersGlobal, setAllUsersGlobal] = useState([]);
  const value = user ? "Sign out" : "Login";
  const auth = getAuth();

  const fetchAllUsers = async () => {
    const allusersLocal = await allUsersFromFirestore();
    setAllUsersGlobal(allusersLocal); // Update state directly
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value === "Sign out") {
      signOut(auth);
      setAllUsersGlobal([]);
    } else {
      navigate("/");
    }
  };
  const handleStartConversation = async (e, recipientID) => {
    e.preventDefault();
    // const conversationID = await < function call > (newMessage, user.uid, recipientID )
    try {
      const conversationID = await initiateConversation(
        message,
        user.uid,
        recipientID
      );
      if (conversationID) {
        navigate(`/user/${conversationID}`)
      }
      // console.log(message);
      // console.log(user?.uid);
      // console.log(recipientID);
    } catch (e) {
      console.log("Users Init Convo error:", e)
    }
    
  };
  // useEffect(() => {
  //   navigate(`/user/${convoID}`)
  // }, [convoID])
  // const handleSendMessage = () => {
  //   console.log("Message Sent")
  // }

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <header className="flex justify-between items-center bg-gray-800 text-white p-6 rounded-lg shadow-md h-20">
        <div>
          <h3 className="text-xl font-bold">Logo</h3>
        </div>

        <div className="ml-auto">
          <form onSubmit={handleSubmit} className="flex">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition duration-300"
            >
              {value}
            </button>
          </form>
        </div>
      </header>

      <div className="users mt-6 space-y-4">
        {allUsersGlobal.map((data) => (
          <div
            key={data.id}
            className="block p-4 bg-white rounded-lg shadow-md hover:bg-gray-100 transition duration-300"
          >
            <div className="users-li text-gray-800 font-semibold">
              {data.username}
            </div>
            <div className="users-li text-gray-800 font-semibold">
              {data.email}
            </div>
            <div className="mt-4">
              <form
                onSubmit={(e) => handleStartConversation(e, data.id)}
                action=""
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  placeholder="say HI 👋"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
