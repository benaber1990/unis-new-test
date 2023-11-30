import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import COLORS from "../misc/COLORS";
import { useIsFocused } from "@react-navigation/native";

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

export default function HubMyPosts() {
  const [content, setContent] = useState("");

  const isFocused = useIsFocused();

  // Get Users
  const fetchContent = () => {
    firebase
      .firestore()
      .collection("hubpostscontent")
      .get()
      .then((querySnapshot) => {
        const contactsArray = [];
        querySnapshot.forEach((doc) => {
          contactsArray.push({
            data: doc.data(),
          });
        });
        setContent(contactsArray);
        console.log(content);
      });
  };

  useEffect(() => {
    fetchContent();
  }, [isFocused]);

  // FlatList

  const Item = ({ title, picLink, category, content, userId }) => (
    <View style={styles.itemStyle}>
      <Image
        source={{ uri: picLink }}
        style={{ width: 300, height: 200, marginBottom: 6, borderRadius: 8 }}
      />
      <Text style={{ color: "white" }}>{title}</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <Item title={item.data.title} picLink={item.data.picLink} />
  );

  return (
    <View style={styles.screenStyle}>
      <Text>Hub My Posts</Text>
      {content && (
        <FlatList
          data={content}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    backgroundColor: COLORS.black,
    alignItems: "center",
  },
  itemStyle: {
    // width: 1,
    marginBottom: 20,
  },
});
