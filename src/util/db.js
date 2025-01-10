import { arrayUnion, serverTimestamp, addDoc, collection, getDoc, getDocs, setDoc, doc } from "firebase/firestore";
import { firestore } from "../firebase/config";
// import { arrayUnion } from "firebase/firestore/lite";

const checkIfUserExists = async (userId) => {
  const docRef = collection(firestore, "Users", userId);
  const documentSnap = await getDoc(docRef);
  if (documentSnap.exists()) {
    return documentSnap.data();
  }
};

const allUsersFromFirestore = async () => {
  const collectionref = collection(firestore, "Users")
  const docSnap = await getDocs(collectionref)
  const allUsers = []
  docSnap.forEach((doc) => {
    allUsers.push({id: doc.id, ...doc.data()})
  })
  return allUsers ;
}

const addDocumentToFirestore = async (data) => {
  try {
    const collectionRef = collection(firestore, "Users");
    const addDocument = await addDoc(collectionRef, data);
  } catch (e) {
    console.error("error adding new doc:", e?.code)
  }
};

const initiateConversation = async (message, senderID, recieverID) => {
  let conversationID = null
  try {
    const newDocRef = await addDoc(collection(firestore, "Conversation"), {
      participants: [senderID, recieverID],
      messages: [
        {
          senderID,
          text: message,
          timestamp: new Date(),
        },
      ],
    });

    conversationID = newDocRef.id;
    return conversationID

  } catch (error) {
    console.error("Error initiating conversation:", error);
    throw error;
  }  
}

const getAllConversationWithID = async (id) => {
try {
  const docRef = doc(firestore, "Conversation", id)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return docSnap.data()
  }
} catch(e) {
  console.log("DB util getAllConversationWithID function", e)
}
}

const addMessageToConversation = async (messageObj,  conversationID) => {
  const conversationRef = doc(firestore, "Conversation", conversationID);

  try {
    await updateDoc(conversationRef, {
      messages: arrayUnion(messageObj), 
    });
    console.log("Message added successfully!");
  } catch (error) {
    console.error("Error adding message:", error);
  }
};

export { checkIfUserExists, addDocumentToFirestore, allUsersFromFirestore, initiateConversation, getAllConversationWithID };
