import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Pressable,
  Alert,
  TouchableOpacity,
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

export default function InductionDisplay({ navigation, route }) {
  // const { site, title, info } = route.params;
  const { title, videoLink, infoHere, hasCompleted, message } = route.params;
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
      `Congratulations, you've completed the ${title} induction`,
      [
        {
          text: "Okay",
          onPress: () => navigationHndl.navigate("InductionsScreen"),
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
        .collection("Inductions")
        .doc(documentId);
      // .collection("UserData");
      await collectionRef.set({
        hasCompleted: true,
        title: title,
        videoLink: videoLink,
        infoHere: infoHere,
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
        style={{
          color: "white",
          marginTop: 30,
          fontSize: 18,
          fontWeight: "700",
        }}
      >
        {title}
      </Text>
      <Video
        ref={video}
        style={{
          width: 300,
          height: 200,
          resizeMode: "contain",
          marginTop: 20,
          marginBottom: 20,
        }}
        source={{
          uri: "https://secure-ds.serving-sys.com/resources/PROD/asset/2/VIDEO/20231020/UKEN_BANANASLUGS1_VIDEO_169AR_15s_MXIV_GLKPR_NA_WM_AMXD0214070H_NSPRE_1_83021391597674906.MP4",
        }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
      />
      <View style={styles.buttons}>
        <Pressable
          onPress={() =>
            status.isPlaying
              ? video.current.pauseAsync()
              : video.current.playAsync()
          }
          style={{ alignSelf: "center", marginBottom: 30 }}
        >
          <Text style={{ fontSize: 18, color: COLORS.mainGreen }}>
            {status.isPlaying ? "Pause" : "Play"}
          </Text>
        </Pressable>
      </View>

      {/*  More Info */}
      <Pressable
        onPress={() =>
          navigation.navigate("InductionMoreInfo", {
            title,
            videoLink,
            infoHere,
            hasCompleted,
            message,
          })
        }
        style={{
          backgroundColor: COLORS.grey,
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 6,
          marginBottom: 20,
        }}
      >
        <Text style={{ color: "white" }}>More Information</Text>
      </Pressable>

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
          I have watched and understand the contents of this Inductions
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
