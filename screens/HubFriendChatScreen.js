import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Pressable,
} from "react-native";
import COLORS from "../misc/COLORS";

import firebase from "firebase/compat";

//FIREBASE CONFIG
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APPID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

//FIREBASE APP
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const HubFriendChatScreen = ({ route }) => {
  const { firstName, userId } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [chatRoomId, setChatRoomId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserUid, setCurrentUserUid] = useState("");
  const [otherUserUid, setOtherUserUid] = useState(userId);
  const [user, setUser] = useState();
  const { uid } = firebase.auth().currentUser;

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        setCurrentUserUid(authUser?.uid);
      } else {
        // User is signed out.
        setUser(null);
      }
    });

    // Clean up the listener when the component unmounts.
    return unsubscribe;
  }, []);

  // Chat Logic

  console.log("USER 2 ID:", userId);

  async function getOrCreateChatRoom() {
    const user1Id = currentUserUid;
    const user2Id = userId;

    // Define the chat room identifier based on user UIDs
    const chatRoomIdentifier =
      user1Id < user2Id ? `${user1Id}_${user2Id}` : `${user2Id}_${user1Id}`;

    // Check if the chat room already exists
    const chatRoomRef = firebase
      .firestore()
      .collection("chats")
      .doc(chatRoomIdentifier);
    const chatRoomSnapshot = await chatRoomRef.get();

    if (chatRoomSnapshot.exists) {
      setChatRoomId(chatRoomIdentifier);
    } else {
      // Create a new chat room if it doesn't exist
      await chatRoomRef.set({
        user1Id,
        uid,
      });

      setChatRoomId(chatRoomIdentifier);
    }
  }

  useEffect(() => {
    // Get or create the chat room
    getOrCreateChatRoom();
  }, [otherUserUid]);

  // Get Chat Data
  useEffect(() => {
    if (chatRoomId) {
      const messagesRef = firebase
        .firestore()
        .collection("chats")
        .doc(chatRoomId)
        .collection("Messages")
        .orderBy("timestamp", "asc");

      const unsubscribe = messagesRef.onSnapshot((querySnapshot) => {
        const chatMessages = [];
        querySnapshot.forEach((doc) => {
          chatMessages.push(doc.data());
          console.log(chatMessages);
        });
        setMessages(chatMessages);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [chatRoomId]);

  // Send Message
  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    const messageData = {
      text: newMessage,
      senderId: uid,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };

    if (chatRoomId) {
      await firebase
        .firestore()
        .collection("chats")
        .doc(chatRoomId)
        .collection("Messages")
        .add(messageData);

      console.log("success!");
      setNewMessage("");
    } else {
      console.log("failed");
      // If chatRoomId is not available, it means the chat room creation is still in progress
      // You can display a loading indicator or prevent sending messages until it's ready
    }
  };

  return (
    <View style={styles.container}>
      {/* Display messages in a FlatList */}
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={
              item.senderId === uid
                ? styles.sentMessage
                : styles.receivedMessage
            }
          >
            <Text>{item.text}</Text>
          </View>
        )}
      />

      {/* Input for sending messages */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={"lightgrey"}
          value={newMessage}
          onChangeText={(t) => setNewMessage(t)}
          onSubmitEditing={sendMessage}
        />
        <Pressable onPress={sendMessage}>
          <Text style={{ fontSize: 16, color: "lightgrey" }}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.black,
  },
  sentMessage: {
    backgroundColor: COLORS.mainGreen,
    padding: 10,
    borderRadius: 8,
    alignSelf: "flex-end",
    marginVertical: 4,
    marginLeft: 60,
  },
  receivedMessage: {
    backgroundColor: COLORS.lightGreen,
    padding: 10,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginVertical: 4,
    marginRight: 60,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  input: {
    flex: 1,
    marginRight: 8,
    padding: 8,
    paddingVertical: 12,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
    color: "white",
  },
});

export default HubFriendChatScreen;
