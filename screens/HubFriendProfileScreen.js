import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import COLORS from "../misc/COLORS";
import { Ionicons } from "@expo/vector-icons";
import EX_CARDS from "../misc/EX_CARDS";
import LATEST_NEWS_DATA from "../misc/LATEST_NEWS_DATA";

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

export default function HubFriendProfileScreen({ navigation, route }) {
  const { firstName, surname, profPic, userId } = route.params;

  const [friends, setFriends] = useState([]);
  const [posts, setPosts] = useState("");
  const [contacts, setContacts] = useState("");

  const isFocused = useIsFocused();

  // Fetch Users
  const fetchUsers = () => {
    firebase
      .firestore()
      .collection("users")
      .get()
      .then((querySnapshot) => {
        const contactsArray = [];
        querySnapshot.forEach((doc) => {
          contactsArray.push({
            data: doc.data(),
          });
        });
        setContacts(contactsArray);
        console.log("success!", contactsArray);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, [isFocused]);

  // Fetch Friend's Post Data
  const fetchUserPosts = () => {
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
        setPosts(contactsArray);
        console.log("success!", contactsArray);
      });
  };

  useEffect(() => {
    fetchUserPosts();
  }, [isFocused]);

  // FlatList
  const Item = ({ title, picLink }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("HubPostDisplay", { title, picLink })}
      style={{ marginRight: 30 }}
    >
      <Image
        source={{ uri: picLink }}
        style={{ height: 180, width: 150, borderRadius: 12 }}
      />
      <Text style={{ color: "white", marginTop: 6, marginHorizontal: 3 }}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <Item
      title={item.data.title}
      picLink={item.data.picLink}
      userId={item.data.userId}
    />
  );

  // Chat Icon
  const ChatIcon = () => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("HubFriendChat", { firstName, userId })
      }
      style={styles.iconContainer}
    >
      <Ionicons name="chatbubble-ellipses-outline" size={24} color="black" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.screenStyle}>
      <Image
        source={{
          uri: profPic,
        }}
        style={{
          height: 100,
          width: 100,
          borderRadius: 50,
          borderWidth: 2,
          borderColor: COLORS.mainGreen,
        }}
      />
      <Text
        style={{
          marginTop: 10,
          fontSize: 22,
          fontWeight: "300",
          color: "lightgrey",
        }}
      >
        {firstName} {surname}
      </Text>
      <Text style={{ color: "lightgrey", fontWeight: "700", marginTop: 2 }}>
        Occupation at Company
      </Text>

      <Text
        style={{
          marginLeft: 20,
          marginTop: 20,
          marginBottom: 10,
          color: "white",
          alignSelf: "flex-start",
          fontSize: 16,
          fontWeight: "300",
        }}
      >
        {firstName}'s{" "}
        <Text style={{ fontWeight: "700", color: COLORS.mainGreen }}>
          UNIS Hub{" "}
        </Text>
        Posts
      </Text>

      {posts && (
        <FlatList
          data={posts}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          ListHeaderComponent={() => <View style={{ marginLeft: 20 }} />}
        />
      )}
      <View
        style={{ alignSelf: "flex-start", marginBottom: 40, marginLeft: 20 }}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("HubRemoveFriend", {
              userId,
              firstName,
            })
          }
        >
          <Text style={{ color: "lightgrey", fontSize: 10 }}>
            Remove {firstName} as Connection
          </Text>
        </TouchableOpacity>
      </View>
      <ChatIcon />
    </View>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    backgroundColor: COLORS.black,
    alignItems: "center",
  },
  iconContainer: {
    position: "absolute",
    bottom: 24,
    right: 16,
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.mainGreen,
  },
});
