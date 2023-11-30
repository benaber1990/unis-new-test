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

const HubAIChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");

  // Function to simulate receiving a message after 2 seconds
  const receiveMessage = (message) => {
    setTimeout(() => {
      setMessages((prevMessages) => [...prevMessages, message]);
    }, 1500);
  };

  // Function to handle sending a message
  const sendMessage = () => {
    if (inputText.trim() !== "") {
      // Simulate sending a message
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: inputText, type: "sent" },
      ]);
      setInputText("");

      // Simulate receiving a response after 2 seconds
      receiveMessage({
        text: "You currently have 8 live projects. 2 are scheduled for completion this month. Would you like to find out more about them?",
        type: "received",
      });
    }
  };

  // Simulate initial message after component mounts
  useEffect(() => {
    receiveMessage({
      text: "Hello, I'm your UNIS AI Chat Bot. How can I help you today?",
      type: "received",
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* Display messages in a FlatList */}
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={
              item.type === "sent" ? styles.sentMessage : styles.receivedMessage
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
          value={inputText}
          onChangeText={(text) => setInputText(text)}
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

export default HubAIChatScreen;
