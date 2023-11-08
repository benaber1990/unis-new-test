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

// Import Firebase
import firebase from "firebase/compat";
import "firebase/compat/database";
import "firebase/auth";

//FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyChtonwBnG-Jzs-gMJRbTChiv-mwt13rNY",
  authDomain: "unis-1.firebaseapp.com",
  projectId: "unis-1",
  storageBucket: "unis-1.appspot.com",
  messagingSenderId: "500039576121",
  appId: "1:500039576121:web:af595bd3bc72422d4fbbe8",
  measurementId: "G-HY5WS3ZXYD",
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

  // Firebase User Info
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
      console.log(user.uid);
    });

    return () => unsubscribe();
  }, []);

  // Add Data to Firestore
  const addDataToFirestore = async () => {
    try {
      const collectionRef = firebase
        .firestore()
        .collection("users")
        .doc(user.uid);
      // .collection("UserData");
      await collectionRef.update({
        userEx: "fdsffsd",
        locationEx: "Liverpool",
        numberEx: 124555,
        booleanEx: true,
        bio: bio,
        otherData: "this here",
      });
      console.log("Data added to Firestore:", user.uid, bio);
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
          <TextInput
            value={bio}
            onChangeText={(t) => setBio(t)}
            style={styles.textInputStyle}
            placeholder="Enter Your Bio Here"
            placeholderTextColor={"lightgrey"}
            multiline={true}
            textAlignVertical="top"
          />
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
