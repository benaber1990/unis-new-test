import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import COLORS from "../misc/COLORS";
import { useIsFocused } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

// Import Firebase
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
export default function HubRemoveFriend({ route }) {
  const { uid } = firebase.auth().currentUser;
  const navigationHdnl = useNavigation();

  // Handle Reject Request
  const removeFriendHandler = async () => {
    try {
      const collectionRef = firebase.firestore().collection("users").doc(uid);

      // Remove userId from the friendsRequest array
      await collectionRef.update({
        friendRequests: firebase.firestore.FieldValue.arrayRemove(userId),
      });
      console.log("Data added to Firestore:");
      alert(`You have removed ${firstName} as a connection`);
      navigationHdnl.navigate("HubFriendsList");
    } catch (error) {
      console.error("Error adding data to Firestore:", error);
    }
  };

  const { firstName, userId } = route.params;
  return (
    <View style={styles.screenStyle}>
      <Text>Hub Remove Friend</Text>
      <Text style={{ color: "white" }}>Remove {firstName} as connection</Text>

      <TouchableOpacity
        onPress={removeFriendHandler}
        style={{
          borderWidth: 1,
          borderColor: "darkgrey",
          paddingVertical: 10,
          paddingHorizontal: 15,
          borderRadius: 4,
          marginTop: 40,
        }}
      >
        <Text style={{ color: "darkgrey" }}>Yes, remove connection</Text>
      </TouchableOpacity>
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
