import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Pressable,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import COLORS from "../misc/COLORS";
import { Video, ResizeMode } from "expo-av";
import Checkbox from "expo-checkbox";
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

export default function DrawingDisplay({ route }) {
  // const { site, title, info } = route.params;
  const { title, videoLink, infoHere, hasCompleted, imageUrl, message } =
    route.params;
  const video = useRef(null);
  const [status, setStatus] = useState({});
  const [isChecked, setChecked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const navigationHndl = useNavigation();

  const { uid } = firebase.auth().currentUser;

  // Alert
  const createAlert = () =>
    Alert.alert(
      "Induction Completed!",
      `Congratulations, you've marked the ${title} drawing as complete`,
      [
        {
          text: "Okay",
          onPress: () => navigationHndl.navigate("DrawingsScreen"),
          style: "cancel",
        },
      ]
    );

  // Firebase User Info
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
      console.log(uid);
    });

    return () => unsubscribe();
  }, []);

  // Mark As Complete
  const markAsComplete = async (documentId) => {
    try {
      const collectionRef = firebase
        .firestore()
        .collection("adminNotifications")
        .doc(uid)
        .collection("Drawings")
        .doc(documentId);
      // .collection("UserData");
      await collectionRef.set({
        hasCompleted: true,
        title: title,
        videoLink: videoLink,
        infoHere: infoHere,
        submitDate: new Date(),
      });
      console.log("Data added to Firestore:");
      createAlert();
    } catch (error) {
      console.error("Error adding data to Firestore:", error);
    }
  };

  return (
    <View style={styles.screenStyle}>
      <Text
        style={{ color: "white", fontSize: 16, fontWeight: 700, marginTop: 30 }}
      >
        {title}
      </Text>

      <View>
        <Image
          style={{
            height: 200,
            width: 200,
            backgroundColor: COLORS.grey,
            borderRadius: 12,
            marginTop: 20,
            marginBottom: 30,
          }}
          source={{ uri: imageUrl }}
        />
      </View>

      {message && (
        <Text style={{ marginHorizontal: 30, color: "white" }}>{message}</Text>
      )}

      <View style={styles.buttons}></View>

      {/* Check */}
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 30,
          alignItems: "center",
        }}
      >
        <Checkbox
          style={{ marginRight: 5 }}
          value={isChecked}
          onValueChange={setChecked}
          color={isChecked ? COLORS.mainGreen : COLORS.lightGreen}
        />
        <Text
          style={{ fontSize: 12, fontWeight: "300", color: COLORS.lightGreen }}
        >
          Confirm completion of this drawing. Mark as complete
        </Text>
      </View>

      {/* Submit */}
      <TouchableOpacity
        onPress={() => markAsComplete(title)}
        style={{
          marginTop: 20,
          backgroundColor: COLORS.mainGreen,
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 6,
        }}
      >
        <Text style={{ fontWeight: "600" }}>Save & Submit</Text>
      </TouchableOpacity>

      {!isCompleted && <Text></Text>}

      {isCompleted && (
        <View>
          <Text style={{ color: "white" }}>
            Congratulations, this induction has been completed
          </Text>
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
  signCardStyle: {
    width: 300,
    backgroundColor: COLORS.lightGreen,
  },
});
