import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import COLORS from "../misc/COLORS";
import { AntDesign } from "@expo/vector-icons";

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

export default function HubNonFriendUser({ route, navigation }) {
  const { firstName, surname, occupation, userId, profPic } = route.params;
  const [hasSentHandler, sethasSentHandler] = useState(false);
  const { hasRequested, setHasRequested } = useState(true);
  const { uid } = firebase.auth().currentUser;

  // Handle Accept Request
  const sendRequestHandler = async () => {
    try {
      const collectionRef = firebase.firestore().collection("users").doc(uid);

      // Add userId to the friends array
      await collectionRef.update({
        friends: firebase.firestore.FieldValue.arrayUnion(userId),
      });

      // Remove userId from the friendsRequest array
      await collectionRef.update({
        friendRequests: firebase.firestore.FieldValue.arrayRemove(userId),
      });
      console.log("Data added to Firestore:");
      alert("Your connection request has been sent");
      // hasSentHandler(true);
    } catch (error) {
      console.error("Error adding data to Firestore:", error);
    }
  };

  // Handle Reject Request
  const sendRejectHandler = async () => {
    try {
      const collectionRef = firebase.firestore().collection("users").doc(uid);

      // Remove userId from the friendsRequest array
      await collectionRef.update({
        friendRequests: firebase.firestore.FieldValue.arrayRemove(userId),
      });
      console.log("Data added to Firestore:");
      alert("Your connection request has been sent");
      // hasSentHandler(true);
    } catch (error) {
      console.error("Error adding data to Firestore:", error);
    }
  };

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
          borderColor: COLORS.lightGreen,
          marginTop: 20,
          marginBottom: 8,
        }}
      />
      <Text
        style={{
          fontSize: 22,
          fontWeight: "300",
          marginBottom: 3,
          color: "lightgrey",
        }}
      >
        {firstName} {surname}
      </Text>
      <Text style={{ color: "darkgrey" }}>{occupation}</Text>
      <Pressable onPress={() => navigation.navigate("HubAddFriend")}>
        <Text style={{ color: "darkgrey" }}>Add as Friend</Text>
      </Pressable>

      {/* Accept Friend Request */}
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity>
          <Text style={{ fontSize: 12, color: "grey", marginTop: 20 }}>
            Approve or Reject Name's Connection Request
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            alignSelf: "center",
            marginVertical: 10,
          }}
        >
          <TouchableOpacity onPress={sendRequestHandler}>
            <AntDesign
              name="checkcircleo"
              size={30}
              color={COLORS.mainGreen}
              style={{ marginRight: 10 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={sendRejectHandler}>
            <AntDesign
              name="closecircleo"
              size={30}
              color={COLORS.lightGreen}
              style={{ marginLeft: 10 }}
            />
          </TouchableOpacity>
        </View>
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
