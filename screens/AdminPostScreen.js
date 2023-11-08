import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import COLORS from "../misc/COLORS";

import * as ImagePicker from "expo-image-picker";

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

export default function AdminPostScreen() {
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [newUrl, setNewUrl] = useState("Hello");
  const [title, setTitle] = useState("");
  const [inputDd, setInputDd] = useState("");
  const [inputMm, setInputMm] = useState("");
  const [inputYyyy, setInputYyyy] = useState("");
  const [inputDate, setInputDate] = useState("");

  const [postTitle, setPostTitle] = useState("");
  const [postCategory, setPostCategory] = useState("");
  const [postImageUrl, setPostImageUrl] = useState("");
  const [postContent, setPostContent] = useState("");

  const setInputData = `${inputYyyy}-${setInputMm}-${inputDd}`;

  const expiryDateInDate = new Date(setInputData);

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

  // Update Profile Picture in User object
  const updateCollectionHandler = async (imageUrl) => {
    try {
      const collectionRef = firebase
        .firestore()
        .collection("adminposts")
        .doc(postTitle);
      await collectionRef.set({
        picLink: imageUrl,
        title: postTitle,
        content: postContent,
        category: postCategory,
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
          updateCollectionHandler(res);
          const { uid } = firebase.auth().currentUser;
          firebase
            .firestore()
            .collection("contentpics")
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
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.screenStyle}>
        <Text style={{ marginBottom: 20 }}>Admin Post Screen</Text>
        <Text style={{ marginBottom: 20, fontWeight: "600" }}>
          Dev Mode Only
        </Text>

        {/* Post Title */}
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              marginBottom: 4,
            }}
          >
            Post Title
          </Text>
          <TextInput
            value={postTitle}
            onChangeText={(t) => setPostTitle(t)}
            style={styles.textInputStyle}
          />
        </View>

        {/* Category */}
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              marginBottom: 4,
            }}
          >
            Post Category
          </Text>
          <TextInput
            style={styles.textInputStyle}
            value={postCategory}
            onChangeText={(t) => setPostCategory(t)}
          />
        </View>

        {/* Image */}

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

        {/* Content */}
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              marginBottom: 4,
            }}
          >
            Post Content
          </Text>
          <TextInput
            value={postContent}
            onChangeText={(t) => setPostContent(t)}
            multiline={true}
            textAlignVertical="top"
            style={[
              styles.textInputStyle,
              {
                height: 150,
                padding: 10,
              },
            ]}
          />
        </View>
        {/* Submit Screen */}
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
            paddingVertical: 12,
            paddingHorizontal: 20,
            backgroundColor: COLORS.lightGreen,
            marginBottom: 40,
          }}
        >
          <Text>Save & Submit</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
  },
  textInputStyle: {
    height: 50,
    width: 300,
    borderRadius: 12,
    backgroundColor: "lightgrey",
    color: "black",
    paddingLeft: 15,
  },
});
