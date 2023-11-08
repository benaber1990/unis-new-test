import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import COLORS from "../misc/COLORS";
import EX_PROFILE_DATA from "../misc/EX_PROFILE_DATA";
import LATEST_NEWS_DATA from "../misc/LATEST_NEWS_DATA";
import * as ImagePicker from "expo-image-picker";
import firebase from "firebase/compat";
import "firebase/compat/database";
import { useIsFocused } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

import NOTIFICATIONS_DATA from "../misc/NOTIFICATIONS_DATA";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import TextCardComp from "../miscComps/TextCardComp";

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

function UserScreen({ navigation }) {
  const storage = getStorage();
  const [url, setUrl] = useState();
  const [hasNots, setHasNots] = useState(false);
  const [data, setData] = useState([]);
  const [contacts, setContacts] = useState("");
  const navigationHndl = useNavigation();

  const { uid } = firebase.auth().currentUser.uid;

  // Firebase User Info
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
      console.log(user.uid);
    });

    return () => unsubscribe();
  }, []);

  // Fetch Data
  // Fetch User Data
  const isFocused = useIsFocused();

  const fetchData = async () => {
    try {
      const { uid } = firebase.auth().currentUser;
      if (!uid) return;
      const collectionRef = firebase.firestore().collection("users").doc(uid);
      const snapshot = await collectionRef.get();
      // console.log("snapshotdata", snapshot?.data());
      // const fetchedData = snapshot.docs.map((doc) => ({
      //   id: doc.id,
      //   ...doc.data(),
      // }));
      // console.log("fetchedData", snapshot?.data());

      setData(snapshot?.data());
      console.log(data.firstName);
      // console.log("Hello");
      // console.log(data);
      // console.log(data[0].firstName);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isFocused]);

  // Fetch Profile Image
  const fetchProfPic = () => {
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .collection("profpics")
      .get()
      .then((querySnapshot) => {
        const contactsArray = [];
        querySnapshot.forEach((doc) => {
          contactsArray.push({
            data: doc.data(),
          });
        });
        setContacts(contactsArray);
        console.log(contacts);
      });
  };

  useEffect(() => {
    fetchProfPic();
  }, [isFocused]);

  // // Collect user data from Firebase - for Userdata
  // const isFocused = useIsFocused();
  // const fetchData = async () => {
  //   try {
  //     const { uid } = firebase.auth().currentUser;
  //     if (!uid) return;
  //     const collectionRef = firebase.firestore().collection("users").doc(uid);
  //     const snapshot = await collectionRef.get();
  //     console.log("snapshotdata", snapshot?.data());
  //     // const fetchedData = snapshot.docs.map((doc) => ({
  //     //   id: doc.id,
  //     //   ...doc.data(),
  //     // }));
  //     console.log("fetchedData", snapshot?.data());
  //     setData(snapshot?.data());
  //     // console.log("Hello");
  //     // console.log(data);
  //     // console.log(data[0].firstName);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, [isFocused]);

  // The path of the picked image
  const [pickedImagePath, setPickedImagePath] = useState("");
  // This function is triggered when the "Select an image" button pressed
  const showImagePicker = async () => {
    // Ask the user for the permission to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();

    // Explore the result
    console.log(result);

    if (!result.cancelled) {
      setPickedImagePath(result.uri);
      /// function from above code block.
      await uploadImage(result?.uri, `${Date.now()}_photo`);
    }
  };
  const uploadImage = async (data, imageName) => {
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
            .update(
              {
                imageUrl: res,
                // Add more fields as needed
              },
              { merge: true }
            )
            .catch((err) => {
              console.log("err", err);
            });
        });
        setUrl(imgUrl);
        console.log("Uploaded a blob or file!");
      });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  // Has Notifications Logic
  const NUMNOTS = NOTIFICATIONS_DATA.length;

  useEffect(() => {
    NUMNOTS > 0 ? setHasNots(true) : setHasNots(false);
  }),
    [];

  // Fetch Post Content
  const fetchDocPics = () => {
    firebase
      .firestore()
      .collection("adminposts")
      .get()
      .then((querySnapshot) => {
        const contactsArray = [];
        querySnapshot.forEach((doc) => {
          contactsArray.push({
            data: doc.data(),
          });
        });
        setContacts(contactsArray);
        console.log("success!", contacts);
      });
  };

  useEffect(() => {
    fetchDocPics();
  }, [isFocused]);

  const Item = ({ title, picLink }) => (
    <Pressable
      onPress={() => navigation.navigate("ContentDisplay")}
      style={styles.itemStyle}
    >
      <Image
        source={{ uri: picLink }}
        style={{ height: 150, width: 150, borderRadius: 6 }}
      />
      <View style={{ maxWidth: 150, padding: 20 }}>
        <Text>Category</Text>
        <Text style={{ fontSize: 16, fontWeight: "600", color: "white" }}>
          {title}
        </Text>
        <View
          style={{
            backgroundColor: COLORS.mainGreen,
            alignSelf: "flex-start",
            // marginLeft: 2,
            paddingHorizontal: 8,
            paddingVertical: 5,
            borderRadius: 2,
            marginTop: 10,
          }}
        >
          <Text style={{ fontWeight: "600" }}>Read More</Text>
        </View>
      </View>
    </Pressable>
  );

  const renderItem = ({ item }) => (
    <Item title={item.data.title} picLink={item.data.picLink} />
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.black }}>
      <View style={styles.screenStyle}>
        {/* Header */}
        <View style={styles.headerContainer}>
          {/* Col A */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <View>
              <View>
                <Image
                  source={{ uri: data?.profPic }}
                  style={{
                    height: 70,
                    width: 70,
                    borderRadius: 35,
                    borderWidth: 2,
                    borderColor: COLORS.mainGreen,
                  }}
                />
              </View>
            </View>

            <View
              style={{
                justifyContent: "center",
                marginRight: 40,
                marginLeft: 10,
              }}
            >
              <Text
                style={{
                  color: "white",
                  marginLeft: 30,
                  fontSize: 20,
                  fontWeight: "500",
                }}
              >
                Hello, {data?.firstName}
              </Text>
            </View>
          </View>

          {/* Col B */}
          {!hasNots ? (
            <Pressable onPress={() => navigation.navigate("ExampleAnimate")}>
              <Ionicons
                name="notifications"
                size={30}
                color={COLORS.lightGreen}
                style={{ marginRight: 10 }}
              />
            </Pressable>
          ) : (
            <Pressable
              onPress={() => navigation.navigate("ExampleAnimate")}
              style={{ alignItems: "center" }}
            >
              <View
                style={{
                  height: 6,
                  width: 6,
                  borderRadius: 3,
                  backgroundColor: "red",
                  marginRight: 10,
                  marginBottom: 1,
                }}
              />
              <Ionicons
                name="notifications"
                size={30}
                color={COLORS.mainGreen}
                style={{ marginRight: 10 }}
              />
            </Pressable>
          )}
        </View>

        {/* Get Support Button*/}
        <Pressable
          onPress={() => navigation.navigate("ContactScreen")}
          style={styles.buttonStyle}
        >
          <Entypo
            name="help-with-circle"
            size={24}
            color={COLORS.mainGreen}
            style={{ marginRight: 10 }}
          />
          <Text style={{ fontSize: 16, fontWeight: "600" }}>
            Get Help/Support
          </Text>
        </Pressable>

        {/* Update Profile Button */}
        <Pressable
          onPress={() => navigation.navigate("UpdateProfile")}
          style={styles.buttonStyle}
        >
          <Ionicons
            name="person-circle-outline"
            size={24}
            color={COLORS.mainGreen}
            style={{ marginRight: 10 }}
          />
          <Text style={{ fontSize: 16, fontWeight: "600" }}>
            Update my Profile
          </Text>
        </Pressable>

        {/* <Pressable
          onPress={showImagePicker}
          style={[styles.buttonStyle, { backgroundColor: COLORS.grey }]}
        >
          <Image
            style={{
              height: 80,
              width: 80,
              borderRadius: 40,
              borderColor: "black",
            }}
            source={{ uri: pickedImagePath }}
          />
          <Text style={{ fontSize: 16, fontWeight: "600", color: "white" }}>
            upload images
          </Text>
        </Pressable> */}

        {/* Test Firebase Button */}
        {/* <Pressable
        onPress={() => AxiosComp()}
        style={{ marginTop: 30, padding: 20, backgroundColor: "#fafafa" }}
      >
        <Text>Send Data</Text>
      </Pressable> */}

        {/* Content FlatList */}
        <View style={{ height: 200, marginTop: 40 }}>
          {contacts && (
            <FlatList
              data={contacts}
              renderItem={renderItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              ListHeaderComponent={() => <View style={{ marginLeft: 20 }} />}
            />
          )}
        </View>

        {/* More Info Section */}
        {/* <View
          style={{
            backgroundColor: COLORS.black,
            // paddingBottom: 300,
            marginTop: 40,
            paddingBottom: 60,
            flexDirection: "row",
          }}
        >
          <FontAwesome
            name="linkedin-square"
            size={32}
            color="white"
            style={{ marginRight: 15 }}
          />
          <FontAwesome name="facebook-square" size={32} color="white" />
          <FontAwesome
            name="instagram"
            size={32}
            color="white"
            style={{ marginLeft: 15 }}
          />
        </View> */}
        <View style={{ height: 40 }} />
        {/* Reset Password */}
        {/* <Pressable
          onPress={() => navigation.navigate("PasswordReset")}
          style={{ alignItems: "center" }}
        >
          <Text style={{ color: "white", fontWeight: "300" }}>
            Lost Password?{" "}
            <Text style={{ textDecorationLine: "underline" }}>
              Click here to reset
            </Text>
          </Text>
        </Pressable> */}

        {/* Text Card */}
        <TextCardComp
          backCol={COLORS.grey}
          title={"Explore UNIS Integration Features"}
          body={
            "Find out how the UNIS app seamlessly integrates with the UNIS Portal to power your construction projects"
          }
          link={() => navigation.navigate("ContactScreen")}
          buttonText={"Book a Demo Now"}
          titleColor={"white"}
          bodyColor={"white"}
        />

        {/* Log Out */}
        <Pressable
          onPress={() => navigation.navigate("ConfirmLogOut")}
          style={{ paddingTop: 30, paddingBottom: 30 }}
        >
          <Text style={{ color: COLORS.lightGreen }}> Log out of UNIS</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    alignItems: "center",
    flex: 1,
    backgroundColor: COLORS.black,
    // alignItems: "center",
    paddingTop: 60,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonStyle: {
    backgroundColor: COLORS.lightGreen,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  itemStyle: {
    flexDirection: "row",
    marginRight: 30,
    marginTop: 20,
    backgroundColor: COLORS.grey,
    padding: 15,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.mainGreen,
  },
});

export default UserScreen;
