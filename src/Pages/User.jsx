import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authStateChange } from "../util/auth";
import { getConversationWithID, addMessageToConversation } from "../util/db";

const User = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userID, setUserID] = useState(null)
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, loading } = authStateChange();


// const addDbmessagesToSentMEssages = (doc) => {
//     setSentMessages((prevMessages) => [
//       ...prevMessages,
//       {
//         id: doc.senderID,
//         text: doc.text,
//         timestamp: doc.timestamp,
//       },
//     ]);
//   };
  
const loadAllPreviousConversation = async () => {
    try {
        const conversation = await getConversationWithID(id);
        if (conversation) {
            conversation.messages.map((message) => {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                      id: message.senderID,
                      text: message.text,
                      timestamp: message.timestamp,
                    },
                  ]);
            })
        }

        else console.log("what is this man")
      }catch(e) {
        console.log("Omo GUYYYY!!! ", e)
      }
  }

//   Generate all previous conversations when the page loads
//   useEffect(() => {
//     loadAllPreviousConversation()
//   }, [] )

// For checking if user is logged in
  useEffect(() => {
    if (!loading) {
        setUserID((value) => {
            value = user.uid
        })
        loadAllPreviousConversation()
      if (!user) {
        navigate("/");
      }
    }

  }, [user]);

  const handleSendMessage = () => {
    if (input.trim()) {
        const messageOBj = {
            senderID : userID,
            text: input.trim(),
            timestamp: new Date()
        }
        addMessageToConversation(messageOBj, id)
        setMessages((prev) => [
            ...prev,
            messageOBj
        ])

      setInput("");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-lg rounded-lg">
      <div className="space-y-4 max-h-60 overflow-y-auto">
        {messages.map((messageobj, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg ${
                messageobj.senderID === userID
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 text-black"
            }`}
          >
            <p>{messageobj.text}</p>
            {/* <span className="text-xs text-gray-500">
              {messageobj.timestamp.}
            </span> */}
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
