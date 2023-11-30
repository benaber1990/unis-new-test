import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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

export default function HubFriendAdd({ navigation, route }) {
  const { firstName, userId, profPic, surname } = route.params;

  const { uid } = firebase.auth().currentUser;

  const [hasSent, setHasSent] = useState(false);

  const hasSentHandler = () => {
    setHasSent(true);
  };

  // Add Data to Firestore
  const sendRequestHandler = async () => {
    try {
      const collectionRef = firebase
        .firestore()
        .collection("users")
        .doc(userId);
      // .collection("UserData");
      await collectionRef.update({
        friendRequests: firebase.firestore.FieldValue.arrayUnion(uid),
      });
      console.log("Data added to Firestore:");
      alert("Your connection request has been sent");
      hasSentHandler(true);
    } catch (error) {
      console.error("Error adding data to Firestore:", error);
    }
  };

  return (
    <View style={styles.screenStyle}>
      <Image
        source={{ uri: profPic }}
        style={{
          height: 100,
          width: 100,
          borderRadius: 50,
          borderWidth: 1,
          borderColor: COLORS.lightGreen,
          marginBottom: 10,
        }}
      />
      <Text style={{ color: "white", fontSize: 22 }}>
        {firstName} {surname}
      </Text>

      {/* Add Friend */}
      {!hasSent && (
        <TouchableOpacity
          onPress={sendRequestHandler}
          style={{ alignItems: "center", marginTop: 30 }}
        >
          <Ionicons name="person-add" size={24} color={COLORS.mainGreen} />
          <Text
            style={{ color: COLORS.mainGreen, fontSize: 16, fontWeight: "300" }}
          >
            Add as Connection
          </Text>
        </TouchableOpacity>
      )}

      {/* Submitted Alert */}
      {hasSent && (
        <View
          style={{
            width: 250,
            height: 175,
            backgroundColor: "white",
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 40,
            paddingHorizontal: 20,
          }}
        >
          <Text style={{ fontWeight: "700", marginBottom: 3 }}>Success!</Text>
          <Text style={{ textAlign: "center" }}>
            Your connection request to {firstName} has been sent
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("FindFriends")}
            style={{
              marginTop: 10,
              paddingVertical: 8,
              paddingHorizontal: 15,
              borderRadius: 15,
              backgroundColor: COLORS.mainGreen,
            }}
          >
            <Text>Continue</Text>
          </TouchableOpacity>
        </View>
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
});
