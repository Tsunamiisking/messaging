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
    <div className="p-4 max-w-md mx-auto bg-white shadow-lg rounded-lg">
      <div className="space-y-4 max-h-60 overflow-y-auto">
        {messages.map((messageobj, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg ${
              messageobj.senderID === user.uid
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 text-black"
            }`}
          >
            <p>{messageobj.text}</p>
            <span className="text-xs text-gray-500">
              {new Date(messageobj.timestamp.seconds * 1000).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex">
        <textarea
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="p-2 border border-gray-300 rounded-l-lg w-full"
        />
        <button
          onClick={handleSendMessage}
          className="p-2 bg-blue-500 text-white rounded-r-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default User;
