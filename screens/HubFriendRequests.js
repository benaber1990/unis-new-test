import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import demoFriendsData from "../misc/DEMO_FRIENDS";
import COLORS from "../misc/COLORS";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

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

export default function HubFriendRequests({ navigation }) {
  const [contacts, setContacts] = useState("");

  const [friends, setFriends] = useState([]);
  const { uid } = firebase.auth().currentUser;

  const fetchFriendRequests = async () => {
    try {
      const userId = uid; // Replace with the actual user ID

      // Get the user document
      const userDoc = await firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .get();
      const userData = userDoc.data();

      // Get the friends IDs
      const friendIds = userData.friendRequests || [];

      // Fetch the friends' details
      const friendsData = await Promise.all(
        friendIds.map(async (friendId) => {
          const friendDoc = await firebase
            .firestore()
            .collection("users")
            .doc(friendId)
            .get();
          return {
            userId: friendId,
            data: friendDoc.data(),
          };
        })
      );

      setFriends(friendsData);
      console.log("FRIENDS DATA", friendsData);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  useEffect(() => {
    fetchFriendRequests();
  }, []);

  // FlatList
  const Item = ({ firstName, userId, profPic, surname }) => (
    <View style={{ marginBottom: 20 }}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("HubNonFriendUser", {
            firstName,
            userId,
            profPic,
            surname,
          })
        }
        HubNonFriendUser
        style={styles.itemStyle}
      >
        <View style={{ flexDirection: "row" }}>
          <Image
            source={{
              uri: profPic,
            }}
            style={{
              marginRight: 10,
              height: 40,
              width: 40,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: COLORS.lightGreen,
            }}
          />
          <View style={{}}>
            <Text style={{ fontSize: 18, color: "lightgrey" }}>
              {firstName} {surname}
            </Text>
            <Text style={{ fontSize: 14, color: "lightgrey" }}>Occupation</Text>
          </View>
        </View>
        <Ionicons
          name="person-add-outline"
          size={20}
          color="white"
          style={{ marginRight: 30 }}
        />
      </TouchableOpacity>
      <View
        style={{
          height: 1,
          backgroundColor: "grey",
          width: 270,
          alignSelf: "center",
        }}
      />
    </View>
  );

  const renderItem = ({ item }) => (
    <Item
      firstName={item.data.firstName}
      surname={item.data.surname}
      userId={item.data.userId}
      profPic={item.data.profPic}
    />
  );

  return (
    <View style={styles.screenStyle}>
      <Text>Hub Friend Requests</Text>

      {friends && (
        <FlatList
          data={friends}
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
    marginBottom: 20,
    flexDirection: "row",
    width: 300,
    alignItems: "center",
    justifyContent: "space-between",
  },
});
