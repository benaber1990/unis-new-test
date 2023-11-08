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

export default function AddNewCard() {
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [newUrl, setNewUrl] = useState("Hello");
  const [title, setTitle] = useState("");
  const [inputDd, setInputDd] = useState("");
  const [inputMm, setInputMm] = useState("");
  const [inputYyyy, setInputYyyy] = useState("");
  const [inputDate, setInputDate] = useState("");

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
            .collection("cards")
            .doc(title)
            .set(
              {
                imageUrl: res,
                title: title ? title : "",
                expiryDate: "12345",
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
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <View style={styles.screenStyle}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ alignItems: "center" }}>
            <Pressable onPress={pickImage} style={{}}>
              <MaterialCommunityIcons
                name="upload-lock"
                size={72}
                color={COLORS.mainGreen}
              />
            </Pressable>

            <View
              style={{ alignSelf: "center", padding: 20, marginBottom: 20 }}
            >
              <Text style={{ color: "white", fontSize: 24, fontWeight: "500" }}>
                Upload New Card
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
                    placeholder="Enter a Title here"
                    placeholderTextColor={"lightgrey"}
                    value={title}
                    onChangeText={(text) => {
                      setTitle(text);
                    }}
                  />
                  <Text
                    style={{
                      color: "white",
                      marginBottom: 8,
                      textAlign: "center",
                      marginTop: 20,
                      marginHorizontal: 30,
                    }}
                  >
                    Please enter the expiry date of your card{"\n"}in DD/MM/YYY
                    format
                  </Text>
                  <View
                    style={{ flexDirection: "row", justifyContent: "center" }}
                  >
                    <TextInput
                      style={{
                        backgroundColor: COLORS.grey,
                        width: 60,
                        height: 50,
                        textAlign: "center",
                        borderRadius: 4,
                        alignSelf: "center",
                        color: "white",
                        fontSize: 16,
                        marginRight: 10,
                      }}
                      placeholder="DD"
                      keyboardType="numeric"
                      placeholderTextColor={"lightgrey"}
                      value={inputDd}
                      onChangeText={(text) => {
                        setInputDd(text);
                      }}
                    />
                    <TextInput
                      style={{
                        backgroundColor: COLORS.grey,
                        width: 60,
                        height: 50,
                        textAlign: "center",
                        borderRadius: 4,
                        alignSelf: "center",
                        color: "white",
                        fontSize: 16,
                      }}
                      keyboardType="numeric"
                      placeholder="MM"
                      placeholderTextColor={"lightgrey"}
                      value={inputMm}
                      onChangeText={(text) => {
                        setInputMm(text);
                      }}
                    />
                    <TextInput
                      style={{
                        backgroundColor: COLORS.grey,
                        width: 90,
                        height: 50,
                        textAlign: "center",
                        borderRadius: 4,
                        alignSelf: "center",
                        color: "white",
                        fontSize: 16,
                        marginLeft: 10,
                      }}
                      keyboardType="numeric"
                      placeholder="YYYY"
                      placeholderTextColor={"lightgrey"}
                      value={inputYyyy}
                      onChangeText={(text) => {
                        setInputYyyy(text);
                      }}
                    />
                  </View>
                </View>

                <Pressable
                  style={{
                    backgroundColor: COLORS.mainGreen,
                    paddingVertical: 15,
                    paddingHorizontal: 25,
                    borderRadius: 4,
                    marginTop: 20,
                    alignSelf: "center",
                    marginBottom: 40,
                  }}
                  onPress={() => {
                    uploadImage(image, `${Date.now()}_photo`, "cards", title);
                  }}
                >
                  <Text style={{ fontWeight: "700" }}>Submit Document</Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* <Pressable
          onPress={() => console.log(expiryDateInDate)}
          style={{ padding: 20, backgroundColor: "tomato", marginTop: 60 }}
        >
          <Text>Test Expiry Date</Text>
        </Pressable> */}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
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