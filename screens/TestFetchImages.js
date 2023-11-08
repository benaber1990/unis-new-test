import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Pressable, Button } from "react-native";

import firebase from "firebase/compat";
// import firebase from "firebase/compat/app";
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

export default function TestFetchImages() {
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState();

  // Get User Info
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
      console.log(user);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  //   Fetch Profile Image
  const fetchImageData = () => {
    firebase
      .firestore()
      .collection("users")
      .doc(user.uid)
      .collection("profpics")
      .get()
      .then((querySnapshot) => {
        const contactsArray = [];
        querySnapshot.forEach((doc) => {
          contactsArray.push({
            data: doc.data(),
          });
        });
        setContacts(contactsArray);
        console.log(contacts);
      });
  };

  return (
    <View style={styles.screenStyle}>
      <Text>Test Fetch Images Screen</Text>

      {/* Fetch Button */}
      {/* <Button title="Fetch Data" onPress={fetchImageData} /> */}

      {contacts && (
        <View>
          <Text>Contacts</Text>
          {/* <Image
            source={{ uri: contacts[0].imageUrl }}
            style={{ height: 200, width: 300 }}
          /> */}
          {contacts?.map((i) => (
            <View>
              <Image
                source={{ uri: i.data.imageUrl }}
                style={{ height: 200, width: 200 }}
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
