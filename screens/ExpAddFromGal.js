import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import COLORS from "../misc/COLORS";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

import firebase from "firebase/compat";

// import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/auth";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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

export default function ExpAddFromGal() {
  const [image, setImage] = useState(null);
  const [newUrl, setNewUrl] = useState("");
  const [title, setTitle] = useState("");

  const { uid } = firebase.auth().currentUser;
  const navigationHndl = useNavigation();

  // Select Image
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0,
    });

    // console.log(result);
    console.log(result.assets[0].uri);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setNewUrl(result.assets[0].uri);
    }
  };

  // Upload Image
  const uploadImage = async (data, imageName, colName, title) => {
    const storage = getStorage();
    try {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", data, true);
        xhr.send(null);
      });
      const imageRef = ref(storage, `images/${imageName}`);
      await uploadBytes(imageRef, blob).then(async (snapshot) => {
        let imgUrl = await getDownloadURL(imageRef).then((res) => {
          const { uid } = firebase.auth().currentUser;
          const collectionRef = firebase
            .firestore()
            .collection("users")
            .doc(uid)
            .collection("receipts")
            .doc();
          collectionRef
            .set(
              {
                imageUrl: res,
                title: title ? title : "",
                // expiryDate: selectedDate,
                documentId: collectionRef.id,
                // Add more fields as needed
              }
              // { merge: true }
            )
            .then((res) => {
              alert("New Receipt Added Successfully");
              navigationHndl.navigate("ExpensesTracker");
              console.log(uid);
            })
            .catch((err) => {
              console.log("err", err);
            });
        });
        console.log("Uploaded a blob or file!");
        // navigationHndl.navigate("HomeScreen");
      });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <View style={styles.screenStyle}>
      <Text>Exp Add from Gal</Text>

      <TouchableOpacity
        onPress={pickImage}
        style={{
          borderWidth: 1,
          borderColor: COLORS.mainGreen,
          paddingHorizontal: 15,
          paddingVertical: 10,
          borderRadius: 4,
        }}
      >
        <Text style={{ fontSize: 16, color: COLORS.mainGreen }}>
          Select Image
        </Text>
      </TouchableOpacity>

      {image && (
        <View style={{ alignItems: "center" }}>
          <Image
            source={{ uri: image }}
            style={{
              width: 200,
              height: 200,
              marginTop: 20,
              borderWidth: 2,
              borderColor: "white",
            }}
          />

          <TextInput
            style={styles.textInputStyle}
            placeholder="Enter a title for your receipt"
            placeholderTextColor={"white"}
            value={title}
            onChangeText={(t) => setTitle(t)}
          />
        </View>
      )}

      <TouchableOpacity
        onPress={() => {
          uploadImage(image, `${Date.now()}_photo`, "certs", title);
        }}
        style={styles.submitButton}
      >
        <Text style={{ fontWeight: "700" }}>Submit</Text>
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
  submitButton: {
    backgroundColor: COLORS.mainGreen,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 40,
  },
  textInputStyle: {
    height: 40,
    width: 260,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "white",
    fontSize: 16,
    color: "white",
    marginTop: 20,
    paddingLeft: 20,
    paddingRight: 10,
  },
});
