import React, { useState, useRef } from "react";
import { Camera, CameraType } from "expo-camera";
import {
  Button,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  ScrollView,
  View,
  TextInput,
  Image,
} from "react-native";
import COLORS from "../misc/COLORS";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

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

export default function ExpensesAddNew({ navigation }) {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [picTaken, setPicTaken] = useState(false);
  const [hasReceipts, setHasReceipts] = useState(false);
  const [enterSubmit, setEnterSubmit] = useState(false);
  const cameraRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");

  const navigationHndl = useNavigation();

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  // Handle taking a photo
  const handleTakePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0 };
      const { uri } = await cameraRef.current.takePictureAsync(options);
      setCapturedImage(uri);
      setEnterSubmit(true);
      setImage(uri);
      console.log(uri);
    }
  };

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

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
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.black }}>
      <View style={styles.screenStyle}>
        <View style={{ marginLeft: 40, marginBottom: 30, marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: "white" }}>
            Receipt Scanner
          </Text>
          <Text
            style={{ fontWeight: "400", color: COLORS.mainGreen, marginTop: 8 }}
          >
            Capture the full receipt within the camera outline
          </Text>
        </View>
        {!enterSubmit && (
          <View
            style={{
              borderWidth: 3,
              borderColor: COLORS.mainGreen,
              width: 306,
              borderRadius: 12,
              alignSelf: "center",
            }}
          >
            <View style={styles.container}>
              <Camera style={styles.camera} type={type} ref={cameraRef}>
                <View style={styles.buttonContainer}>
                  {/* <TouchableOpacity
                style={styles.button}
                onPress={toggleCameraType}
              >
                <Text style={styles.text}>Flip Camera</Text>
              </TouchableOpacity> */}
                </View>
              </Camera>
            </View>
          </View>
        )}
        {!enterSubmit && (
          <View
            style={{
              marginTop: 20,
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity onPress={handleTakePicture}>
              <AntDesign
                name="checkcircleo"
                size={42}
                color={COLORS.mainGreen}
                style={{ marginHorizontal: 26 }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("ExpensesTracker")}
            >
              <AntDesign
                name="closecircleo"
                size={42}
                color={COLORS.mainGreen}
                style={{ marginHorizontal: 26 }}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      {enterSubmit && (
        <View style={{ alignItems: "center", marginTop: 30 }}>
          <TextInput
            style={styles.textInputStyle}
            placeholder="Enter a title for your receipt"
            placeholderTextColor={"lightgrey"}
            value={title}
            onChangeText={(t) => setTitle(t)}
          />
          {capturedImage && (
            <Image
              source={{ uri: capturedImage }}
              style={{
                height: 150,
                width: 150,
                borderRadius: 12,
                marginTop: 30,
              }}
            />
          )}
          <TouchableOpacity
            onPress={() => setEnterSubmit((p) => !p)}
            style={{ marginTop: 30 }}
          >
            <Text style={{ color: "white" }}>Take a different picture</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              uploadImage(image, `${Date.now()}_photo`, "certs", title);
            }}
            style={styles.submitButton}
          >
            <Text style={{ fontWeight: "700" }}>Save & Submit</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  container: {
    justifyContent: "center",
    width: 300,
    height: 400,

    alignSelf: "center",
  },
  camera: {
    flex: 1,
    borderRadius: 12,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    // margin: 64,
    paddingBottom: 20,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  textInputStyle: {
    height: 50,
    width: 270,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "lightgrey",
    fontSize: 16,
    paddingLeft: 20,
    color: "white",
  },
  submitButton: {
    backgroundColor: COLORS.mainGreen,
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
});
