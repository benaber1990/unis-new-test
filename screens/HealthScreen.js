import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import COLORS from "../misc/COLORS";
import { useIsFocused } from "@react-navigation/native";

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

export default function HealthScreen() {
  const [text, setText] = useState("");
  const [user, setUser] = useState(null);
  const { uid } = firebase.auth().currentUser;
  const [contacts, setContacts] = useState("");

  // Date and Time
  const currentDate = new Date();
  const uniqueId = currentDate.getTime().toString();

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
        .doc(user.uid)
        .collection("healthrecords")
        .doc(uniqueId);
      // .collection("UserData");
      await collectionRef.set({
        healthRecord: text,
      });
      console.log("Data added to Firestore:", user.uid);
      submitAlert();
    } catch (error) {
      console.error("Error adding data to Firestore:", error);
    }
  };

  const isFocused = useIsFocused();

  // Fetch Data
  // Fetch Document Images
  const fetchDocPics = () => {
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .collection("healthrecords")
      .get()
      .then((querySnapshot) => {
        const contactsArray = [];
        querySnapshot.forEach((doc) => {
          contactsArray.push({
            data: doc.data(),
          });
        });
        setContacts(contactsArray);
        console.log("success!", contacts);
      });
  };

  useEffect(() => {
    fetchDocPics();
  }, [isFocused]);

  //   SubmitAlert
  //   const alertOkay = console.log("Yesss");

  const submitAlert = () => (
    Alert.alert("Congratulations!", "You've updated your health info"),
    [
      {
        text: "Okay",
      },
    ]
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.black }}>
      {/* Header Info */}
      <View style={styles.screenStyle}>
        <Text
          style={{
            color: COLORS.lightGreen,
            marginHorizontal: 40,
            textAlign: "center",
          }}
        >
          You can use this screen to share health information about yourself.
        </Text>

        {/* Box Input Health */}
        <TextInput
          value={text}
          onChangeText={(t) => setText(t)}
          style={styles.textInputStyle}
          placeholder="Enter Your Health Info Here"
          placeholderTextColor={"lightgrey"}
          multiline={true}
          textAlignVertical="top"
        />

        {/* Submit Button */}
        <View>
          <Pressable onPress={addDataToFirestore} style={styles.buttonStyle}>
            <Text style={{ fontWeight: "700" }}>Save & Submit</Text>
          </Pressable>
        </View>
      </View>

      {/* Prev Health Records */}
      <Text
        style={{
          color: COLORS.lightGreen,
          marginLeft: 20,
          marginBottom: 20,
          fontWeight: "700",
          // textAlign: "center",
        }}
      >
        Your Previous Health Updates
      </Text>
      <View
        style={{
          alignItems: "center",
        }}
      >
        {contacts &&
          contacts.map((i) => (
            <View
              style={{
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 15,
                paddingRight: 60,
                borderRadius: 6,
                backgroundColor: COLORS.lightGreen,
                marginBottom: 20,
              }}
            >
              <Text>{i.data.healthRecord}</Text>
            </View>
          ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    backgroundColor: COLORS.black,
    alignItems: "center",
    paddingTop: 20,
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
    marginTop: 20,
  },

  buttonStyle: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: COLORS.mainGreen,
    marginBottom: 40,
  },
});
