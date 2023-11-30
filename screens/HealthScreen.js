import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  TouchableOpacity,
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

export default function HealthScreen() {
  const [text, setText] = useState("");
  const [user, setUser] = useState(null);
  const { uid } = firebase.auth().currentUser;
  const [contacts, setContacts] = useState([]);

  // Date and Time
  // const currentDate = new Date();
  // const uniqueId = currentDate.getTime().toString();

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
    const today = new Date();
    // Format the date in DD.MM.YYYY format
    const formattedDate =
      today.getDate() +
      "." +
      (today.getMonth() + 1) +
      "." +
      today.getFullYear();

    try {
      const collectionRef = firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .collection("healthrecords")
        .doc();
      // .collection("UserData");
      await collectionRef.set({
        healthRecord: text,
        dateAdded: formattedDate,
        recordId: collectionRef.id,
        // postedDate: currentDate,
      });
      console.log("Data added to Firestore:", user.uid);
      fetchDocPics();
      submitAlert();
    } catch (error) {
      console.error("Error adding data to Firestore:", error);
    }
  };

  const isFocused = useIsFocused();

  // Fetch Data
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

  const deleteDocument = (documentId) => {
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .collection("healthrecords")
      .doc(documentId)
      .delete()
      .then(() => {
        fetchDocPics();
        console.log("Document successfully deleted!");
      })
      .catch((error) => {
        console.error("Error deleting document: ", error);
      });
  };

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
          Please be aware that this can be seen by other users such as Site
          Managers. Only share relevant health information you are comfortable
          with others seeing
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
          <TouchableOpacity
            onPress={addDataToFirestore}
            style={styles.buttonStyle}
          >
            <Text style={{ fontWeight: "700" }}>Save & Submit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Prev Health Records */}
      <Text
        style={{
          color: "#fafafa",
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
                paddingRight: 15,
                borderRadius: 6,
                backgroundColor: COLORS.grey,
                borderWidth: 1,
                borderColor: "white",
                marginBottom: 20,
                width: 250,
              }}
            >
              <Text style={{ color: "lightgrey", marginBottom: 10 }}>
                {i.data.dateAdded}
              </Text>
              <Text style={{ color: "white" }}>{i.data.healthRecord}</Text>

              <TouchableOpacity
                onPress={() => deleteDocument(i.data.recordId)}
                style={{ alignSelf: "flex-end" }}
              >
                <Text style={{ color: "lightgrey" }}>Remove Record</Text>
              </TouchableOpacity>
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
    borderWidth: 1,
    borderColor: "white",
    width: 320,
    height: 150,
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
    borderRadius: 4,
    backgroundColor: COLORS.mainGreen,
    marginBottom: 40,
  },
});
