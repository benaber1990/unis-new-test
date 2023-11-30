import React, { useState, useEffect } from "react";
import {
  Button,
  Image,
  View,
  Text,
  Platform,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import COLORS from "../misc/COLORS";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigation } from "@react-navigation/native";

import firebase from "firebase/compat";

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

export default function AddNewCard({ navigation }) {
  const [image, setImage] = useState(null);
  const [newUrl, setNewUrl] = useState("Hello");
  const { uid } = firebase.auth().currentUser;
  const [title, setTitle] = useState("");
  const [inputDd, setInputDd] = useState();
  const [inputMm, setInputMm] = useState();
  const [inputYyyy, setInputYyyy] = useState();
  const [docId, setDocId] = useState("");

  const selectedDate = new Date(inputYyyy, inputMm - 1, inputDd);

  const navigationHndl = useNavigation();

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0,
    });

    console.log(result);

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
            .collection("cards")
            .doc();
          collectionRef
            .set(
              {
                imageUrl: res,
                title: title ? title : "",
                expiryDate: selectedDate,
                documentId: collectionRef.id,
                category: "",
                hideNot: false,
                message: "",
                collection: "cards",
                backImageUrl: "",
                // Add more fields as needed
              }
              // { merge: true }
            )
            .then((res) => {})
            .catch((err) => {
              console.log("err", err);
            });
        });

        navigationHndl.navigate("AllCards");
      });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.black }}>
      <View style={styles.screenStyle}>
        <Text>YourComponentName</Text>

        {/* Choose File */}
        <TouchableOpacity onPress={pickImage} style={styles.selectButtonStyle}>
          <Text style={styles.selectButtonText}>
            Select File - From Gallery
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("AddNewCardPhoto")}
          style={[
            styles.selectButtonStyle,
            {
              backgroundColor: COLORS.black,
              borderWidth: 1,
              borderColor: "white",
            },
          ]}
        >
          <Text
            style={[
              styles.selectButtonText,
              {
                color: "white",
              },
            ]}
          >
            Select File - Take New Photo
          </Text>
        </TouchableOpacity>

        {/* Take Picture */}
        {/* <TouchableOpacity style={styles.selectButtonStyle}>
          <Text style={styles.selectButtonText}>
            Take Photo - Front of Card
          </Text>
        </TouchableOpacity> */}

        {image && (
          <View>
            <Image
              source={{ uri: image }}
              style={{ width: 300, height: 200, borderRadius: 12 }}
            />

            {/* Text Input */}
            <View style={{ marginTop: 30, alignItems: "center" }}>
              <Text
                style={{
                  alignSelf: "flex-start",
                  color: "white",
                  marginLeft: 20,
                }}
              >
                Card Title
              </Text>
              <TextInput
                style={styles.textInputStyle}
                placeholder="Enter the card title"
                placeholderTextColor={"lightgrey"}
                value={title}
                onChangeText={(t) => setTitle(t)}
              />

              {/* Expiry Date */}
              <Text
                style={{
                  color: "white",

                  marginTop: 20,
                }}
              >
                Card Expiry Date
              </Text>
              <View
                style={{ flexDirection: "row", justifyContent: "flex-start" }}
              >
                <TextInput
                  style={[
                    styles.textInputStyle,
                    {
                      width: 50,
                      paddingLeft: 0,
                      textAlign: "center",
                    },
                  ]}
                  placeholder="DD"
                  placeholderTextColor={"lightgrey"}
                  value={inputDd}
                  onChangeText={(t) => setInputDd(t)}
                />
                <TextInput
                  style={[
                    styles.textInputStyle,
                    {
                      width: 50,
                      marginHorizontal: 10,
                      paddingLeft: 0,
                      textAlign: "center",
                    },
                  ]}
                  placeholder="MM"
                  placeholderTextColor={"lightgrey"}
                  value={inputMm}
                  onChangeText={(t) => setInputMm(t)}
                />
                <TextInput
                  style={[
                    styles.textInputStyle,
                    {
                      width: 80,
                      paddingLeft: 0,
                      textAlign: "center",
                    },
                  ]}
                  placeholder="YYYY"
                  placeholderTextColor={"lightgrey"}
                  value={inputYyyy}
                  onChangeText={(t) => setInputYyyy(t)}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                uploadImage(image, `${Date.now()}_photo`, "cards", title);
              }}
              style={styles.submitButtonStyle}
            >
              <Text style={{ fontWeight: "700" }}>Submit</Text>
            </TouchableOpacity>
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
    alignItems: "center",
  },

  selectButtonStyle: {
    backgroundColor: COLORS.mainGreen,
    width: 220,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 4,
    marginBottom: 20,
  },
  selectButtonText: {
    fontWeight: "700",
  },
  submitButtonStyle: {
    backgroundColor: COLORS.mainGreen,
    paddingVertical: 15,
    borderRadius: 30,
    paddingHorizontal: 30,
    alignSelf: "center",
    marginTop: 20,
  },
  textInputStyle: {
    width: 270,
    height: 50,
    backgroundColor: COLORS.grey,
    paddingLeft: 20,
    fontSize: 16,
    borderRadius: 6,
    marginTop: 3,
    color: "white",
  },
});
