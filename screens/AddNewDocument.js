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
import * as ImagePicker from "expo-image-picker";
import COLORS from "../misc/COLORS";
import { uploadImage } from "./helpers/helpers";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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

export default function AddNewDocument() {
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [newUrl, setNewUrl] = useState("Hello");
  const [title, setTitle] = useState("");

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
            .collection("certs")
            .doc(title)
            .set(
              {
                imageUrl: res,
                title: title ? title : "",
                // Add more fields as needed
              }
              // { merge: true }
            )
            .then((res) => {
              alert("New Certificate Added Successfully");
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
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.black }}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <View style={styles.screenStyle}>
          <Pressable onPress={pickImage} style={{}}>
            <MaterialCommunityIcons
              name="upload-lock"
              size={72}
              color={COLORS.mainGreen}
            />
          </Pressable>

          <View style={{ alignSelf: "center", padding: 20, marginBottom: 20 }}>
            <Text style={{ color: "white", fontSize: 24, fontWeight: "500" }}>
              Upload New Certificate
            </Text>
          </View>

          <Pressable
            onPress={pickImage}
            style={{
              paddingVertical: 15,
              paddingHorizontal: 20,
              backgroundColor: COLORS.lightGreen,
              borderRadius: 6,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "700" }}>
              Select Your File
            </Text>
          </Pressable>

          {image && (
            <ScrollView>
              <View style={{ alignItems: "center", marginTop: 30 }}>
                <Image
                  source={{ uri: image }}
                  style={{ width: 200, height: 200, marginTop: 40 }}
                />
                {/* <Text style={{ color: "white" }}>{`${newUrl}`}</Text> */}
                <View style={{ marginTop: 30 }}>
                  <Text
                    style={{
                      color: "white",
                      marginBottom: 8,
                      textAlign: "center",
                    }}
                  >
                    Please provide a title for your certificate
                  </Text>
                  <TextInput
                    style={{
                      backgroundColor: COLORS.grey,
                      width: 250,
                      height: 50,
                      paddingLeft: 20,
                      borderRadius: 4,
                      alignSelf: "center",
                      color: "white",
                      fontSize: 16,
                    }}
                    value={title}
                    placeholder="Enter a Title"
                    placeholderTextColor={"lightgrey"}
                    onChangeText={(text) => {
                      setTitle(text);
                    }}
                  />
                </View>

                <Pressable
                  style={{
                    backgroundColor: COLORS.mainGreen,
                    paddingVertical: 15,
                    paddingHorizontal: 20,
                    marginTop: 20,
                    alignSelf: "center",
                    borderRadius: 4,
                    marginBottom: 40,
                  }}
                  onPress={() => {
                    uploadImage(image, `${Date.now()}_photo`, "certs", title);
                  }}
                >
                  <Text style={{ fontWeight: "700" }}>Submit Document</Text>
                </Pressable>
              </View>
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    backgroundColor: COLORS.black,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    alignSelf: "center",
    padding: 20,
    marginBottom: 40,
  },
});
