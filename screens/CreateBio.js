import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import COLORS from "../misc/COLORS";
import { useIsFocused } from "@react-navigation/native";

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

export default function CreateBio({ navigation }) {
  const [bio, setBio] = useState("");
  const [text, setText] = useState("");
  const [user, setUser] = useState(null);
  const { uid } = firebase.auth().currentUser;
  const [contacts, setContacts] = useState("");
  const isFocused = useIsFocused();
  const [updateBio, setUpdateBio] = useState("");
  const [data, setData] = useState();

  // Firebase User Info
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  // Fetch bio data
  const fetchData = async () => {
    try {
      const { uid } = firebase.auth().currentUser;
      if (!uid) return;
      const collectionRef = firebase.firestore().collection("users").doc(uid);
      const snapshot = await collectionRef.get();
      setData(snapshot?.data());
      setBio(data?.bio);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isFocused]);

  // Add Data to Firestore
  const addDataToFirestore = async () => {
    try {
      const collectionRef = firebase
        .firestore()
        .collection("users")
        .doc(user.uid);
      // .collection("UserData");
      await collectionRef.update({
        bio: updateBio,
      });
      console.log("Data added to Firestore:");
      submitAlert();
    } catch (error) {
      console.error("Error adding data to Firestore:", error);
    }
  };

  //   SubmitAlert
  //   const alertOkay = console.log("Yesss");

  const submitAlert = () => (
    Alert.alert("Congratulations!", "You've updated your bio"),
    [
      {
        text: "Okay",
        onPress: navigation.navigate("Profile"),
      },
    ]
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <View style={styles.screenStyle}>
        <Text
          style={{
            color: "white",
            fontWeight: "300",
            marginBottom: 20,
            marginTop: -100,
          }}
        >
          Create a Bio{" "}
        </Text>

        {/*   Text Input */}
        <View>
          {data && (
            <TextInput
              value={updateBio}
              onChangeText={(t) => setUpdateBio(t)}
              style={styles.textInputStyle}
              placeholder={data?.bio}
              placeholderTextColor={"lightgrey"}
              multiline={true}
              textAlignVertical="top"
            />
          )}
        </View>

        {/* Submit Button */}
        <Pressable onPress={addDataToFirestore} style={styles.buttonStyle}>
          <Text style={{ fontWeight: "700" }}>Save & Submit</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    backgroundColor: COLORS.black,
    alignItems: "center",
    justifyContent: "center",
  },
  textInputStyle: {
    backgroundColor: COLORS.grey,
    width: 320,
    height: 150,
    // fontWeight: "700",
    fontSize: 16,
    color: "white",
    borderRadius: 6,
    marginBottom: 20,
    paddingTop: 10,
    paddingLeft: 10,
    paddingBottom: 10,
  },

  buttonStyle: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: COLORS.mainGreen,
  },
});
