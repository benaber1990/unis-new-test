import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  Pressable,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import firebase from "firebase/compat";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import COLORS from "../misc/COLORS";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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

export default function CreateProfilePicture({ navigation }) {
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [newUrl, setNewUrl] = useState("Hello");
  const [title, setTitle] = useState("exTitle");

  const navigationHndl = useNavigation();

  // Get User Info
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
      console.log(user);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

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
        navigationHndl.navigate("InitLogin");
      });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.black }}>
      <View style={styles.screenStyle}>
        <Text
          style={{
            color: "white",
            marginTop: 40,
            textAlign: "center",
            fontSize: 16,
            fontWeight: "700",
          }}
        >
          Choose Profile Picture
        </Text>
        <Pressable
          onPress={pickImage}
          style={{
            padding: 20,
            alignItems: "center",
            paddingTop: 60,
            // backgroundColor: "white",
          }}
        >
          <MaterialCommunityIcons
            name="upload-lock"
            size={72}
            color={COLORS.mainGreen}
          />
        </Pressable>

        <Pressable
          onPress={pickImage}
          style={{
            paddingVertical: 15,
            paddingHorizontal: 20,
            borderRadius: 12,
            backgroundColor: COLORS.mainGreen,
            alignSelf: "center",
          }}
        >
          <Text style={{ fontWeight: "700" }}>Select Image</Text>
        </Pressable>

        {image && (
          <View style={{ alignItems: "center", marginTop: 30 }}>
            <Image
              source={{ uri: image }}
              style={{
                width: 200,
                height: 200,
                borderRadius: 100,
                // marginTop: 20,
                borderWidth: 3,
                borderColor: COLORS.lightGreen,
              }}
            />
            {/* <Text style={{ color: "white" }}>{`${newUrl}`}</Text> */}
            {/* <View style={{ marginTop: 30 }}>
              <TextInput
                style={{
                  backgroundColor: "white",
                  width: 200,
                  height: 40,
                  paddingLeft: 20,
                  borderRadius: 4,
                }}
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                }}
              />
            </View> */}

            <TouchableOpacity
              style={{
                backgroundColor: COLORS.mainGreen,
                paddingVertical: 15,
                paddingHorizontal: 20,
                marginTop: 20,
                alignSelf: "center",
                // marginBottom: 20,
                borderRadius: 6,
              }}
              onPress={() => {
                uploadImage(image, `${Date.now()}_photo`, "cards", newUrl);
              }}
            >
              <Text style={{ fontWeight: "700" }}>Save & Submit Image</Text>
            </TouchableOpacity>

            <Text
              style={{
                color: "white",
                marginTop: 10,
                marginHorizontal: 30,
                textAlign: "center",
              }}
            >
              When updating your profile, you may be asked to log in for
              security
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
});
