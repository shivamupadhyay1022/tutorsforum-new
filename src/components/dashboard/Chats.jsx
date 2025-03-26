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
import { useNavigate } from "react-router-dom";
function Chats() {
  const [data, setData] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [recentChatDetails, setRecentChatDetails] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [ChatUsers, setChatUsers] = useState([]);
  const [activeChatInfo, setActiveChatInfo] = useState(null);
  const [seed, setSeed] = useState(0);
  var messageList = [];
  const navigate = useNavigate();

  useLayoutEffect(() => {
    fetchData();
    fetchRecentChat();
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && activeChat) {
      const unsubscribe = fetchMessages(
        ft,
        currentUser,
        activeChat,
        setMessages
      );
      fetchCurrentChatInfo();
      return () => unsubscribe();
    }
    // console.log(messages);
  }, [currentUser, activeChat]);

  const fetchCurrentChatInfo = async () => {
    if (!currentUser || !activeChat) return;

    const tutorRef = ref(db, `tutors/${activeChat}`);
    const userRef = ref(db, `users/${activeChat}`);

    const snapshot = await get(tutorRef);
    if (snapshot.exists()) {
      const tutorData = snapshot.val();
      console.log(tutorData);
      setActiveChatInfo(tutorData);
    } else {
      const userSnapshot = await get(userRef);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.val();
        setActiveChatInfo(userData);
      }
    }
  };

  const fetchMessages = (firestore, currentUser, activeChat, setMessages) => {
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
                    profilePic: tutorData.profilepic || "https://cdn.pixabay.com/photo/2023/05/02/10/35/avatar-7964945_960_720.png",
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
                          profilePic: userData.profilepic || "https://cdn.pixabay.com/photo/2023/05/02/10/35/avatar-7964945_960_720.png",
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
      <div className="container mx-auto px-4 py-8 pt-16">
        <div className="flex flex-col gap-4">
          {/* Contacts Sidebar */}
          <div
            className={` ${
              toggle ? "min-w-[320px]" : "w-[50px]"
            } fixed left-0 bg-slate-200 rounded-r-2xl min-h-[90vh]  z-[100]`}
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
                {recentChatDetails?.map((contact, index) => (
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
                        src={contact.profilePic || "https://cdn.pixabay.com/photo/2023/05/02/10/35/avatar-7964945_960_720.png"}
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
                          src={contact.profilepic || "https://cdn.pixabay.com/photo/2023/05/02/10/35/avatar-7964945_960_720.png"}
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
          <div className="w-full pb-16 pl-[35px]">
            {/* Chat Header */}
            <div className="bg-gradient-to-r justify-between from-peach-100 via-white to-peach-100 pl-2 pr-16 md:pl-12 md:pr-36 left-12 right fixed w-full h-12 flex z-50 border-b-2 border-white">
              <div className="flex items-center space-x-2">
                <img
                  src={activeChatInfo?.profilepic || "https://cdn.pixabay.com/photo/2023/05/02/10/35/avatar-7964945_960_720.png"}
                  className="rounded-full h-8 w-8"
                />
                <p className="font-serif">{activeChatInfo?.name}</p>
              </div>
              <button
              onClick={() => navigate(`/tutor/${activeChat}`)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="black"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                  />
                </svg>
              </button>
            </div>

            {/* Messages Section */}
            <div className="p-4 h-[calc(100vh-8rem)] overflow-y-auto flex flex-col space-y-4">
              {messages &&
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.isSentByMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.isSentByMe
                          ? "bg-peach-100 text-gray-800"
                          : "bg-gray-100"
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            {/* Message Input - Sticky at Bottom */}
            <div className="w-full fixed bottom-0 left-0 pl-[35px] z-50 bg-white border-t border-gray-300 py-2">
              <div className="flex items-center space-x-2 px-4 md:w-3/5 mx-auto">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendChat();
                  }}
                  placeholder="Type your message..."
                  className="w-full h-10 rounded-md border border-gray-300 px-3 text-base focus:outline-none focus:ring-2 focus:ring-peach-400"
                />
                <button
                  onClick={sendChat}
                  className="bg-gray-400 py-2 px-4 rounded-full hover:bg-gray-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-white"
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
  );
}

export default Chats;
