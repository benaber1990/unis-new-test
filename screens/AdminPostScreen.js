import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  TouchableOpacity,
  Image,
} from "react-native";
import COLORS from "../misc/COLORS";
import * as ImagePicker from "expo-image-picker";
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

export default function AdminPostScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

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

  const submitPostHandler = () => {
    navigationHndl.navigate("Hub");
    setTitle("");
    setDescription("");
  };

  return (
    <View style={styles.screenStyle}>
      <View style={{}}>
        {/* Title */}
        <TextInput
          placeholder="Title"
          placeholderTextColor={"lightgrey"}
          style={styles.textInputStyle}
          value={title}
          onChangeText={(t) => setTitle(t)}
        />

        {/* Description */}
        <TextInput
          placeholder="Description"
          placeholderTextColor={"lightgrey"}
          style={[styles.textInputStyle, { height: 150, paddingTop: 15 }]}
          textAlignVertical="top"
          multiline
          value={description}
          onChangeText={(t) => setDescription(t)}
        />

        {/* Image */}
        <TouchableOpacity onPress={pickImage}>
          <Text
            style={{
              color: COLORS.mainGreen,
              fontSize: 18,
              fontWeight: "300",
              textAlign: "center",
            }}
          >
            Select Image
          </Text>
        </TouchableOpacity>
      </View>

      {/* If Image */}
      {image && (
        <View style={{ alignItems: "center" }}>
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
            onPress={submitPostHandler}
            style={styles.buttonStyle}
          >
            <Text style={{ fontWeight: "700", fontSize: 18 }}>Post to Hub</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Submit Button */}
    </View>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    backgroundColor: COLORS.black,
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
  },
  textInputStyle: {
    height: 60,
    width: 300,
    borderRadius: 6,
    fontSize: 18,
    fontWeight: "300",
    backgroundColor: COLORS.grey,
    borderWidth: 1,
    paddingLeft: 20,
    marginBottom: 20,
    color: COLORS.mainGreen,
  },
  cardView: {
    paddingHorizontal: 40,
    paddingBottom: 20,
    paddingTop: 20,
    backgroundColor: COLORS.grey,
  },
  buttonStyle: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: COLORS.mainGreen,
    marginTop: 40,
  },
});
