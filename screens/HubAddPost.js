import React, { useState, useEffect, Platform } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import COLORS from "../misc/COLORS";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";

// import firebase from "firebase/compat/app";
import firebase from "firebase/compat";
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

export default function HubAddPost() {
  const [user, setUser] = useState(null);
  const [newUrl, setNewUrl] = useState("Hello");
  const [title, setTitle] = useState("");
  const [inputDd, setInputDd] = useState("");
  const [inputMm, setInputMm] = useState("");
  const [inputYyyy, setInputYyyy] = useState("");
  const [inputDate, setInputDate] = useState("");
  const { uid } = firebase.auth().currentUser;
  const isFocused = useIsFocused();

  const [postTitle, setPostTitle] = useState("");
  const [postCategory, setPostCategory] = useState("");
  const [postImageUrl, setPostImageUrl] = useState("");
  const [postContent, setPostContent] = useState("");

  const setInputData = `${inputYyyy}-${setInputMm}-${inputDd}`;

  const expiryDateInDate = new Date(setInputData);

  const navigationHndl = useNavigation();

  const [image, setImage] = useState(null);

  const [data, setData] = useState();

  // Get Poster Data

  // Fetch User Data
  const fetchData = async () => {
    try {
      const { uid } = firebase.auth().currentUser;
      if (!uid) return;
      const collectionRef = firebase.firestore().collection("users").doc(uid);
      const snapshot = await collectionRef.get();
      setData(snapshot?.data());
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isFocused]);

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

  // Post Content
  const updateCollectionHandler = async (imageUrl) => {
    try {
      const collectionRef = firebase
        .firestore()
        .collection("hubpostscontent")
        .doc();

      const timestamp = firebase.firestore.FieldValue.serverTimestamp();

      await collectionRef.set({
        picLink: imageUrl,
        title: postTitle,
        content: postContent,
        category: postCategory,
        hideNot: false,
        userId: uid,
        postId: collectionRef.id,
        timestamp: timestamp,
        posterName: data?.firstName + " " + data?.surname || "",
        posterProfPic: data?.profPic,
      });
      console.log("Data added to Firestore:");
      setTitle("");
      setPostCategory("");
      setPostContent("");
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
          updateCollectionHandler(res);
          const { uid } = firebase.auth().currentUser;
          firebase
            .firestore()
            .collection("contentpics")
            .doc()
            .set(
              {
                imageUrl: res,
                title: title ? title : "",
                // Add more fields as needed
              }
              // { merge: true }
            )
            .then((res) => {
              alert("Post successfully added!");
              console.log(uid);
              navigationHndl.navigate("Hub");
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
        <Text>Hub Add Post</Text>

        {/* Title */}
        <View>
          <TextInput
            style={styles.textInputStyle}
            placeholder="Post Title"
            placeholderTextColor={"lightgrey"}
            value={postTitle}
            onChangeText={(t) => setPostTitle(t)}
          />
        </View>
        {/* Category */}
        <View>
          <TextInput
            style={styles.textInputStyle}
            placeholder="Category"
            placeholderTextColor={"lightgrey"}
            value={postCategory}
            onChangeText={(t) => setPostCategory(t)}
          />
        </View>
        {/* Content */}
        <View>
          <TextInput
            style={[
              styles.textInputStyle,
              {
                height: 150,
                paddingTop: 15,
                borderRadius: 20,
              },
            ]}
            placeholder="Post Content"
            placeholderTextColor={"lightgrey"}
            textAlignVertical="top"
            multiline
            value={postContent}
            onChangeText={(t) => setPostContent(t)}
          />
        </View>

        {/* Add Image */}
        <TouchableOpacity
          onPress={pickImage}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Text
            style={{ fontSize: 20, fontWeight: "500", color: COLORS.mainGreen }}
          >
            Add Image
          </Text>
          <MaterialIcons
            name="add-a-photo"
            size={24}
            color={COLORS.mainGreen}
            style={{ marginLeft: 10 }}
          />
        </TouchableOpacity>

        {image && (
          <Image
            source={{ uri: image }}
            style={{
              marginTop: 30,
              width: 200,
              height: 200,
              borderWidth: 1,
              borderColor: "white",
            }}
          />
        )}

        {/* Submit Button*/}
        <TouchableOpacity
          onPress={() => {
            uploadImage(image, `${Date.now()}_photo`, "cards", title);
          }}
          style={{
            marginTop: 50,
            paddingVertical: 10,
            paddingHorizontal: 22,
            borderRadius: 20,
            backgroundColor: COLORS.mainGreen,
            borderWidth: 2,
            borderColor: COLORS.grey,
            marginBottom: 40,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "500" }}>Submit Post</Text>
        </TouchableOpacity>
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
  textInputStyle: {
    height: 50,
    width: 300,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 25,
    paddingLeft: 20,
    fontSize: 16,
    fontWeight: "300",
    color: "white",
    marginBottom: 20,
    // backgroundColor: COLORS.grey,
  },
});
