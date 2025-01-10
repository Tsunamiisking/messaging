import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authStateChange } from "../util/auth";
import { getConversationWithID } from "../util/db";

const User = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userID, setUserID] = useState(null)
  const [sentMessages, setSentMessages] = useState([])
  const [recievedMessages, setRecievedMessages] = useState([])
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, loading } = authStateChange();


const handleNewMessage = (doc) => {
    setSentMessages((prevMessages) => [
      ...prevMessages,
      {
        id: doc.senderID,
        message: doc.text,
        timestamp: doc.timestamp,
      },
    ]);
    console.log(sentMessages)
  };

  const getconvo = async () => {
    try {
        const conversation = await getConversationWithID(id);
        if (conversation) {
            // console.log(conversation)
            // console.log(userID)
            conversation.messages.map((doc) => {
                if (doc.senderID === userID) {
                    handleNewMessage(doc)
                }
            })
        }
        else console.log("what is this man")

      }catch(e) {
        console.log("Omo GUYYYY!!! ", e)
      }
  }

//   For Generating or checking if convo exists
  useEffect(() => {
    getconvo()
  }, [] )



// For checking if user is logged in
  useEffect(() => {
    if (!loading) {
        setUserID(user.uid)
        // console.log(userID)
        // console.log(user)
      if (!user) {
        navigate("/");
      }
    }

  }, [user]);

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([
        ...messages,
        { text: input, sender: "You", timestamp: new Date() },
      ]);
      setInput("");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-lg rounded-lg">
      <div className="space-y-4 max-h-60 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg ${
              message.sender === "You"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 text-black"
            }`}
          >
            <p>{message.text}</p>
            <span className="text-xs text-gray-500">
              {message.timestamp.toLocaleTimeString()}
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
