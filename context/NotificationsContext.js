// NotificationContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Animated,
  Button,
  Image,
  ScrollView,
  FlatList,
} from "react-native";
import EX_CARDS from "../misc/EX_CARDS";
import COLORS from "../misc/COLORS";
import { Ionicons, AntDesign, Feather, Octicons } from "@expo/vector-icons";

const NotificationContext = createContext();

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  useEffect(() => {
    // Fetch or calculate the notification status here
    // This can be based on data in your FlatList or any other logic
    // For now, I'm assuming a simple true/false value
    const hasMessages = true;
    /* Logic to determine if there are unread messages */
    setHasUnreadMessages(hasMessages);
  }, []);

  return (
    <NotificationContext.Provider value={{ hasUnreadMessages }}>
      {children}
    </NotificationContext.Provider>
  );
};
