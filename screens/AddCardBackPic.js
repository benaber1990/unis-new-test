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
  AvoidingView,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import COLORS from "../misc/COLORS";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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

export default function AddCardBack({ navigation, route }) {
  const { title } = route.params;

  // NEEDS TO PUSH IMGURLBACK TO USER - CARDS COLLECTION
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [newUrl, setNewUrl] = useState("Hello");
  const [inputDd, setInputDd] = useState("");
  const [inputMm, setInputMm] = useState("");
  const [inputYyyy, setInputYyyy] = useState("");
  const [inputDate, setInputDate] = useState("");

  const setInputData = `${inputYyyy}-${setInputMm}-${inputDd}`;

  const expiryDateInDate = new Date(setInputData);

  const navigationHndl = useNavigation();

  const selectedDate = new Date(inputYyyy, inputMm - 1, inputDd);

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

  // Update Back Card Url in User Card object
  const updateCardBackUrlInUserCardObject = async (imageUrl) => {
    try {
      const collectionRef = firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .collection("cards")
        .doc(title);
      // .collection("UserData");
      await collectionRef.update({
        backImageProfilePic: imageUrl,
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
          updateCardBackUrlInUserCardObject(res);
          const { uid } = firebase.auth().currentUser;
          firebase
            .firestore()
            .collection("users")
            .doc(uid)
            .collection("cardsBack")
            .doc(title)
            .set(
              {
                // imageUrl: res,
                // title: title ? title : "",
                // expiryDate: selectedDate,
                backImgUrl: res,
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
        alert("Congratulations, you've added a new card!");
        navigationHndl.navigate("AllCards", {});
      });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <View style={styles.screenStyle}>
      <Text style={{ color: "white", marginBottom: 10 }}>
        Add a photo of the back of your card (optional)
      </Text>
      <Text style={{ color: "white", fontSize: 18, fontWeight: "700" }}>
        {title}
      </Text>

      {/* Select Image */}

      <TouchableOpacity
        onPress={pickImage}
        style={{
          paddingVertical: 15,
          paddingHorizontal: 20,
          backgroundColor: COLORS.mainGreen,
          borderRadius: 6,
          marginBottom: 20,
          marginTop: 20,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "700" }}>
          Select file - Back of Card
        </Text>
      </TouchableOpacity>

      <Pressable
        onPress={() => navigation.navigate("AllCards")}
        style={{ marginTop: 40 }}
      >
        <Text style={{ color: COLORS.mainGreen, fontSize: 18 }}>
          Return to cards
        </Text>
      </Pressable>

      {/* Image And */}
      {image && (
        <View style={{ alignItems: "center", marginTop: 30 }}>
          <Image
            source={{ uri: image }}
            style={{
              width: 270,
              height: 180,
              borderRadius: 12,
              marginTop: 20,
            }}
          />

          <TouchableOpacity
            style={{
              backgroundColor: COLORS.mainGreen,
              paddingVertical: 15,
              paddingHorizontal: 25,
              borderRadius: 4,
              alignSelf: "center",
              marginBottom: 40,
              marginTop: 40,
            }}
            onPress={() => {
              uploadImage(image, `${Date.now()}_photo`, "cards", title);
            }}
          >
            <Text style={{ fontWeight: "700" }}>Submit & Save</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    backgroundColor: COLORS.black,
    alignItems: "center",
    paddingTop: 120,
  },
});
