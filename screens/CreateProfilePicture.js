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
      quality: 1,
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
        navigationHndl.navigate("HomeScreen");
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

            <Pressable
              style={{
                backgroundColor: COLORS.mainGreen,
                paddingVertical: 15,
                paddingHorizontal: 20,
                marginTop: 20,
                alignSelf: "center",
                marginBottom: 60,
                borderRadius: 6,
              }}
              onPress={() => {
                uploadImage(image, `${Date.now()}_photo`, "cards", newUrl);
              }}
            >
              <Text style={{ fontWeight: "700" }}>Save & Submit Image</Text>
            </Pressable>
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
