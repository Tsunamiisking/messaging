import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authStateChange } from "../util/auth";
import { onSnapshot, Timestamp, doc, collection } from "firebase/firestore";
import { getConversationWithID, addMessageToConversation } from "../util/db";
import { firestore } from "../firebase/config";

const User = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [conversationData, setConversationData] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, loading } = authStateChange();

  useEffect(() => {
    // await getConversationWithID(id, setConversationData);
    const docRef = doc(collection(firestore, "Conversation"), id);
    onSnapshot(docRef, (docSnap) => {
      setConversationData(docSnap.data());
    });
  }, [])


  const handleSendMessage = async () => {
    if (input.trim()) {
      const messageOBj = {
        senderID: user.uid,
        text: input.trim(),
        timestamp: new Date(),
      };
      console.log(messageOBj);
      try {
        await addMessageToConversation(messageOBj, id);
        setInput("");
      } catch (e) {
        console.log("I dont know what is wrong with handle submit", e);
      }
    }
  };

  useEffect(() => {
    // console.log(conversationData)
    if (conversationData) {
      const newMessages = conversationData.messages.map((message) => ({
        senderID: message.senderID,
        text: message.text,
        timestamp: message.timestamp,
      }));
      setMessages([...newMessages]);
    }
  }, [conversationData]);


  // For checking if user is logged in
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/");
      }
    }
  }, [user, loading]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
    {/* Header */}
    <header className="p-4 bg-blue-600 text-white text-center shadow-md">
      <h1 className="text-lg font-semibold">Chat</h1>
    </header>
  
    {/* Messages container */}
    <div
      className="flex-1 overflow-y-auto px-4 py-2 space-y-4"
      ref={(el) => el && el.scrollTo(0, el.scrollHeight)} // Auto-scroll to the bottom
    >
      {messages.map((messageobj, index) => (
        <div
          key={index}
          className={`p-3 rounded-lg max-w-xs ${
            messageobj.senderID === user.uid
              ? "bg-blue-500 text-white self-end ml-auto"
              : "bg-gray-200 text-black mr-auto"
          }`}
        >
          <p className="mb-1">{messageobj.text}</p>
          <span className="text-xs text-gray-400">
            {new Date(messageobj.timestamp.seconds * 1000).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  
    {/* Input area */}
    <div className="p-4 bg-white shadow-inner">
      <div className="flex">
        <textarea
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring focus:border-blue-300"
        />
        <button
          onClick={handleSendMessage}
          className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  </div>
  );
};

export default User;
