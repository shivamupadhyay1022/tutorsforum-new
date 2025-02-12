import React, { useState, useLayoutEffect, useContext, useEffect } from "react";
import { db, ft } from "../../firebase";
import { ref, onValue, set, get } from "firebase/database";
import {
  collection,
  addDoc,
  setDoc,
  doc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  getFirestore,
} from "firebase/firestore";
import { AuthContext } from "../../AuthProvider";
function Chats() {
  const [data, setData] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [recentChatDetails, setRecentChatDetails] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [ChatUsers, setChatUsers] = useState([]);
  const [seed, setSeed] = useState(0);
  var messageList = [];

  useLayoutEffect(() => {
    fetchData();
    fetchRecentChat();
    // console.log(Date.now().toString());
  }, [currentUser]);

  
  // useEffect(() => {
  //   getRecentChatDetails(recentChats, setChatUsers);
  // }, [recentChats]);


  useEffect(() => {
    if (currentUser && activeChat) {
      const unsubscribe = fetchMessages(
        ft,
        currentUser,
        activeChat,
        setMessages
      );
      return () => unsubscribe();
    }
    // console.log(messages);
  }, [currentUser, activeChat]);

  const fetchMessages = (firestore, currentUser, activeChat, setMessages) => {
    //     const querySnapshot =  getDocs(collection(firestore, "chats", currentUser.uid, "messages",));
    // querySnapshot?.forEach((doc) => {
    //   // doc.data() is never undefined for query doc snapshots
    //   console.log(doc.id, " => ", doc.data());
    // });
    if (!currentUser || !activeChat) return;

    const messagesRef = collection(
      firestore,
      "chats",
      currentUser.uid,
      "messages",
      activeChat,
      "messages"
    );
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    return onSnapshot(q, (snapshot) => {
      // console.log(snapshot.docs);
      setMessages(
        snapshot.docs.map((doc) => {
          const data = doc.data();
          let formattedTimestamp = "";

          // Convert Firestore timestamp (handling both types: object and string)
          if (data.timestamp) {
            if (typeof data.timestamp === "object" && data.timestamp.seconds) {
              formattedTimestamp = new Date(
                data.timestamp.seconds * 1000
              ).toLocaleString();
            } else if (typeof data.timestamp === "string") {
              formattedTimestamp = new Date(data.timestamp).toLocaleString();
            }
          }

          return {
            id: data.id,
            sender: data.sender,
            content: data.content,
            timestamp: formattedTimestamp,
            isSentByMe: data.sender === currentUser.uid,
          };
        })
      );
      // console.log(messageList)
      // setMessages(messageList);
    });
  };

  const fetchData = async () => {
    const dataRef = ref(db, "tutors/"); // Replace with your reference
    // dataRef.orderByChild('nestedObject.subject').equalTo('Chemistry')
    onValue(
      dataRef,
      (snapshot) => {
        const retrievedData = [];
        snapshot.forEach((childSnapshot) => {
          const item = childSnapshot.val();
          const uid = childSnapshot.key;
          retrievedData.push({ uid, ...item });
        });
        setData(retrievedData);
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );

    //now fetching the details based on the ids

    // console.log(data);
  };

  const sendChat = async () => {
    const messageData = {
      id: Date.now().toString(), // Unique message ID
      sender: currentUser.uid,
      content: message,
      timestamp: serverTimestamp(),
    };

    try {
      // Store message under both users' chat history
      const senderChatRef = collection(
        ft,
        "chats",
        currentUser.uid,
        "messages",
        activeChat,
        "messages"
      );
      const receiverChatRef = collection(
        ft,
        "chats",
        activeChat,
        "messages",
        currentUser.uid,
        "messages"
      );

      await addDoc(senderChatRef, messageData);
      await addDoc(receiverChatRef, messageData);

      // **Update recent chats for both users**
      const recentChatData = {
        timestamp: serverTimestamp(),
      };

      await setDoc(
        doc(ft, "chats", currentUser.uid, "recent", activeChat),
        recentChatData
      );
      await setDoc(
        doc(ft, "chats", activeChat, "recent", currentUser.uid),
        recentChatData
      );

      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // const messages = [
  //   {
  //     id: 1,
  //     sender: "Nitish Kumar",
  //     content: "Hello! How can I help you today?",
  //     timestamp: "10:00 AM",
  //     isSentByMe: false,
  //   },
  //   {
  //     id: 2,
  //     sender: "You",
  //     content: "Hi! I have a question about the next class.",
  //     timestamp: "10:01 AM",
  //     isSentByMe: true,
  //   },
  // ];
  const [newMessage, setNewMessage] = useState("");
  const [toggle, setToggle] = useState(false);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          sender: "You",
          content: newMessage,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isSentByMe: true,
        },
      ]);
      setNewMessage("");
    }
  };


  const fetchRecentChat = async () => {
    try {
      const recentRef = collection(ft, "chats", currentUser.uid, "recent");
      const querySnapshot = await getDocs(
        query(recentRef, orderBy("timestamp", "desc"))
      );

      const recentChat = querySnapshot.docs.map((doc) => doc.id); // Extract user IDs

      // console.log("Recent Chats:", recentChat);
      setRecentChats(recentChat);
      getRecentChatDetails(recentChat, setChatUsers);
    } catch (error) {
      console.error("Error fetching recent chats:", error);
      return [];
    }
  };

  const getRecentChatDetails = async (recentChats, setChatUsers) => {
    try {
      const userDetails = await Promise.all(
        recentChats.map(async (userId) => {
          const tutorRef = ref(db, `tutors/${userId}`);
          const userRef = ref(db, `users/${userId}`);
  
          return new Promise((resolve) => {
            onValue(
              tutorRef,
              (snapshot) => {
                if (snapshot.exists()) {
                  const tutorData = snapshot.val();
                  resolve({
                    uid: userId,
                    name: tutorData.name || "Unknown",
                    profilePic: tutorData.profilepic || "default_pic_url",
                  });
                } else {
                  onValue(
                    userRef,
                    (userSnapshot) => {
                      if (userSnapshot.exists()) {
                        const userData = userSnapshot.val();
                        resolve({
                          uid: userId,
                          name: userData.name || "Unknown",
                          profilePic: userData.profilepic || "default_pic_url",
                        });
                      } else {
                        resolve(null); // Handle case where user is not found
                      }
                    },
                    { onlyOnce: true }
                  );
                }
              },
              { onlyOnce: true }
            );
          });
        })
      );
  
      const filteredDetails = userDetails.filter((user) => user !== null);
      setChatUsers(filteredDetails);
      setRecentChatDetails(filteredDetails);
      setSeed(Math.random()); // Force re-render
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="flex flex-col gap-4">
          {/* Contacts Sidebar */}
          <div
            className={` ${
              toggle ? "min-w-[320px]" : "w-[50px]"
            } absolute left-0 bg-slate-200 rounded-r-2xl min-h-[85vh]  z-50`}
          >
            <div className={`${toggle ? "p-4" : "p-2"}`}>
              <div className="flex items-center justify-center gap-2">
                {toggle && (
                  <input
                    placeholder="Search conversations..."
                    className="w-full my-2 flex h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />
                )}
                {toggle ? (
                  <div className="flex">
                    <button
                      onClick={handleSendMessage}
                      className="bg-gray-400 py-1.5 px-4 rounded-2xl"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="white"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => setToggle(!toggle)}
                      className=" py-1.5 px-1 rounded-2xl"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setToggle(!toggle)}
                    className=" py-1.5 px-1 rounded-2xl"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </button>
                )}
              </div>
              {/* chats */}
              <div className="space-y-4 mt-4">
                {
                  recentChatDetails?.map((contact, index) => (
                    <div
                      key={index}
                      className={`${
                        toggle ? "p-2 space-x-4" : "p-0 "
                      } flex items-center   rounded-lg hover:bg-gray-100 cursor-pointer`}
                      onClick={() => {
                        setActiveChat(contact.uid);
                        // console.log(activeChat);
                      }}
                    >
                      <div>
                        <img
                          className="rounded-full h-8 w-8"
                          src={contact.profilePic}
                        />
                      </div>
                      {toggle && (
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          {/* <p className="text-sm text-gray-500">{contact.sub}</p> */}
                        </div>
                      )}
                    </div>
                  ))}
                <div class="border-t border-gray-300 my-4"></div>
                {data &&
                  data.map((contact, index) => (
                    <div
                      key={index}
                      className={`${
                        toggle ? "p-2 space-x-4" : "p-0 "
                      } flex items-center   rounded-lg hover:bg-gray-100 cursor-pointer`}
                      onClick={() => {
                        setActiveChat(contact.uid);
                        // console.log(activeChat);
                      }}
                    >
                      <div>
                        <img
                          className="rounded-full h-8 w-8"
                          src={contact.profilepic}
                        />
                      </div>
                      {toggle && (
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          {/* <p className="text-sm text-gray-500">{contact.sub}</p> */}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Chat Window */}
          <div className="w-full pl-[35px]">
            <div className="p-4 h-[calc(100vh-12rem)]">
              <div className="grid grid-cols-1 md:mx-16  justify-center items-center h-full">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages &&
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.isSentByMe ? "justify-end" : "justify-start"
                        }`}
                      >
                        {/* <div>{console.log(message)}</div> */}
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.isSentByMe
                              ? "bg-peach-100 text-gray-800"
                              : "bg-gray-100"
                          }`}
                        >
                          {/* <p className="text-sm font-medium mb-1">
                          {message.sender}
                        </p> */}
                          <p>{message.content}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Message input */}
                <div className="flex absolute bottom-10 md:w-3/5 justify-center items-center justify-self-center space-x-2">
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendChat()} // Trigger sendChat on Enter
                    placeholder="Type your message..."
                    className="w-full mt-1 flex h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />
                  <button
                    onClick={sendChat}
                    className="bg-gray-400 py-1.5 px-4 rounded-2xl"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chats;
