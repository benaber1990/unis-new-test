import React, { useState, useEffect } from "react";
import {
  Button,
  Image,
  View,
  Text,
  StyleSheet,
  Platform,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import COLORS from "../misc/COLORS";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

import firebase from "firebase/compat";

// import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/auth";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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

export default function UpdateProfileImage() {
  const { uid } = firebase.auth().currentUser;
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [newUrl, setNewUrl] = useState("Hello");
  const [title, setTitle] = useState("");
  const [contacts, setContacts] = useState("");
  const [data, setData] = useState("");

  const isFocused = useIsFocused();

  // Firebase User Info
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
      console.log(user.uid);
    });

    return () => unsubscribe();
  }, []);

  // Fetch User Data
  const fetchData = async () => {
    try {
      const { uid } = firebase.auth().currentUser;
      if (!uid) return;
      const collectionRef = firebase.firestore().collection("users").doc(uid);
      const snapshot = await collectionRef.get();
      // console.log("snapshotdata", snapshot?.data());
      // const fetchedData = snapshot.docs.map((doc) => ({
      //   id: doc.id,
      //   ...doc.data(),
      // }));
      // console.log("fetchedData", snapshot?.data());
      setData(snapshot?.data());
      console.log(data.bio);
      // console.log("Hello");
      // console.log(data);
      // console.log(data[0].firstName);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isFocused]);

  // Fetch Current Prof Pic
  const fetchProfPic = () => {
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
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

  useEffect(() => {
    fetchProfPic();
  }, [isFocused]);

  // Select Image
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);
    console.log(result.assets[0].uri);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setNewUrl(result.assets[0].uri);
    }
  };

  // Update Profile Picture in User object
  const updateUserProfObjHandler = async (imageUrl) => {
    try {
      const collectionRef = firebase
        .firestore()
        .collection("users")
        .doc(user.uid);
      // .collection("UserData");
      await collectionRef.update({
        profPic: imageUrl,
      });
      console.log("Data added to Firestore:");
    } catch (error) {
      console.error("Error adding data to Firestore:", error);
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
          updateUserProfObjHandler(res);
          const { uid } = firebase.auth().currentUser;
          firebase
            .firestore()
            .collection("users")
            .doc(uid)
            .collection("profpics")
            .add(
              {
                imageUrl: res,
                title: title ? title : "",
                // Add more fields as needed
              }
              // { merge: true }
            )
            .then((res) => {
              alert("Profile uploaded Successfully");
              console.log(uid);
            })
            .catch((err) => {
              console.log("err", err);
            });
        });
        console.log("Uploaded a blob or file!");
      });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.black }}>
      <View style={styles.screenStyle}>
        {/* Display Existing Profile Image */}
        {/* {contacts && (
          <View style={{ alignItems: "center" }}>
            {contacts?.map((i) => (
              <Pressable>
                <Image
                  source={{ uri: i.data.imageUrl }}
                  style={{
                    height: 100,
                    width: 100,
                    borderRadius: 50,
                    borderWidth: 2,
                    borderColor: COLORS.lightGreen,
                    alignSelf: "center",
                  }}
                />
                <Text
                  style={{
                    color: COLORS.lightGreen,
                    fontWeight: 300,
                    marginTop: 5,
                    fontWeight: "300",
                  }}
                >
                  Your existing profile picture
                </Text>
              </Pressable>
            ))}
          </View>
        )} */}

        {/* Existing Profile Picture */}
        {!image && (
          <View>
            <Image
              source={{ uri: data?.profPic }}
              style={{
                height: 100,
                width: 100,
                borderRadius: 50,
                borderWidth: 2,
                borderColor: COLORS.lightGreen,
                alignSelf: "center",
              }}
            />
            <Text
              style={{
                color: COLORS.lightGreen,
                fontWeight: 300,
                marginTop: 5,
                fontWeight: "300",
              }}
            >
              Your existing profile picture
            </Text>
          </View>
        )}

        {/* Select New Image */}
        <View style={{ marginTop: 30 }}>
          <Pressable
            onPress={pickImage}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 4,
              backgroundColor: COLORS.lightGreen,
            }}
          >
            <Text style={{ fontWeight: "600" }}>Select New Image</Text>
          </Pressable>
        </View>

        {/* Display Image */}
        <Image
          source={{ uri: image }}
          style={{
            width: 160,
            height: 160,
            borderRadius: 80,
            marginTop: 20,
            borderWidth: 2,
            borderColor: COLORS.lightGreen,
          }}
        />
        <Text
          style={{
            color: COLORS.lightGreen,
            fontWeight: 300,
            marginTop: 5,
            fontWeight: "300",
          }}
        >
          Your new profile picture
        </Text>

        {/* Confirm Upload New Image */}
        <View style={{ marginTop: 30 }}>
          <Pressable
            onPress={() => {
              uploadImage(
                image,
                `${Date.now()}_photo`,
                "cards",
                "fdsfdfdfdddd4fdff"
              );
            }}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 4,
              backgroundColor: COLORS.mainGreen,
            }}
          >
            <Text style={{ fontWeight: "600" }}>Confirm New Picture</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    backgroundColor: COLORS.black,
    alignItems: "center",
  },
});
