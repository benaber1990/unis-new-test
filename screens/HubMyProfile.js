import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import COLORS from "../misc/COLORS";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

// import firebase from "firebase/compat/app";
import firebase from "firebase/compat";
import "firebase/compat/database";
import "firebase/auth";

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

import { useIsFocused } from "@react-navigation/native";

export default function HubMyProfile() {
  const [data, setData] = useState();
  const isFocused = useIsFocused();

  const { uid } = firebase.auth().currentUser;

  // Firebase User UID Info
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
      console.log(user.uid);
    });

    return () => unsubscribe();
  }, []);

  // Fetch User Data
  const fetchData = async () => {
    try {
      const { uid } = firebase.auth().currentUser;
      if (!uid) return;
      const collectionRef = firebase.firestore().collection("users").doc(uid);
      const snapshot = await collectionRef.get();
      setData(snapshot?.data());
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isFocused]);

  const IconItem = ({ iconName, title }) => (
    <View
      style={{
        marginHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5,
      }}
    >
      <Ionicons
        name={iconName}
        size={24}
        color="white"
        style={{ marginRight: 6 }}
      />
      <Text style={{ color: "white" }}>{title}</Text>

      <MaterialCommunityIcons name="dots-vertical" size={22} color="white" />
    </View>
  );

  return (
    <View style={styles.screenStyle}>
      <Text>Hub My Profile</Text>

      {/* Profile Pic */}
      <View>
        <Image
          source={{ uri: data?.profPic }}
          style={{
            height: 80,
            width: 80,
            borderRadius: 60,
            borderWidth: 2,
            borderColor: COLORS.mainGreen,
          }}
        />
      </View>

      {/* Profile Name */}
      <View style={{ marginTop: 10 }}>
        <Text
          style={{
            color: "lightgrey",
            fontSize: 22,
            fontWeight: "300",
          }}
        >
          {data?.firstName} {data?.surname}
        </Text>
      </View>

      {/* Job Title */}
      <View>
        <Text style={{ color: "white" }}>{data?.jobTitle}</Text>
      </View>

      {/* Items */}
      <View style={{ marginTop: 10 }}>
        <View style={{ flexDirection: "row" }}>
          <IconItem iconName={"ios-people-circle-outline"} title="Friends" />
          <IconItem iconName={"ios-people-circle-outline"} title="Friends" />
        </View>
        <View style={{ flexDirection: "row" }}>
          <IconItem iconName={"ios-people-circle-outline"} title="Friends" />
          <IconItem iconName={"ios-people-circle-outline"} title="Friends" />
        </View>
      </View>

      {/* Posts */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ color: "white", fontSize: 16 }}>Your Posts</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    backgroundColor: COLORS.black,
    alignItems: "center",
  },
});
