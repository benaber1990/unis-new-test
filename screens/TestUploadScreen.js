import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadImage } from "./helpers/helpers";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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

const DATA = {
  userEx: "ABCDEFG",
  locationEx: "Liverpool",
  numberEx: 1234566,
  booleanEx: true,
};

export default function TestUploadScreen() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [image, setImage] = useState(null);

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
        .collection("UserData")
        .doc("123")
        .collection("TestData");
      await collectionRef.add({
        userEx: "fdsffsd",
        locationEx: "Liverpool",
        numberEx: 124555,
        booleanEx: true,
      });
      console.log("Data added to Firestore");
    } catch (error) {
      console.error("Error adding data to Firestore:", error);
    }
  };

  //   Fetch Data from Firestore
  const fetchAllData = () => {
    firebase
      .firestore()
      .collection("TestData")
      .doc("123")
      .collection("TestData")
      .get()
      .then((querySnapshot) => {
        const contactsArray = [];
        querySnapshot.forEach((doc) => {
          contactsArray.push({
            data: doc.data(),
          });
        });
        setContacts(contactsArray);
      });
  };

  // Image Picker
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView>
      <View style={styles.screenStyle}>
        <View
          style={{
            backgroundColor: "tomato",
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
        >
          <Text style={{ fontWeight: "700" }}>
            Developer Only Screen - TO DELETE
          </Text>
        </View>

        {/* Buttons */}
        <View style={{ padding: 20 }}>
          <Button onPress={addDataToFirestore} title="Upload Data" />
        </View>
        <View style={{ padding: 20 }}>
          <Button onPress={fetchAllData} title="Fetch Data" />
        </View>
        {/* Choose Image */}
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Button
            title="Pick an image from camera roll"
            onPress={pickImage}
            color={"orange"}
          />
          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: 200, height: 200 }}
            />
          )}
        </View>
        <View style={{ padding: 20 }}>
          <Button
            onPress={() => {
              uploadImage(image, `${Date.now()}_photo`, "cards", "title");
            }}
            title="Upload Image"
            color={"orange"}
          />
        </View>

        {/* Display Data */}
        <View>
          {contacts.map((contact) => {
            return (
              <View>
                <Text>{contact.data.locationEx}</Text>
                <Text>{contact.data.numberEx}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
});
