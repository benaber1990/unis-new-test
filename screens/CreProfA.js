import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Pressable,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import COLORS from "../misc/COLORS";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";

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

//FIREBASE APPi

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default function CreateProfileA({ navigation }) {
  const [creProfA, setCreProfA] = useState(true);
  const [creProfB, setCreProfB] = useState(false);
  const [creProfC, setCreProfC] = useState(false);
  const [creProfD, setCreProfD] = useState(false);
  const [creProfE, setCreProfE] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const navigationHndl = useNavigation();

  const [image, setImage] = useState(null);
  const [newUrl, setNewUrl] = useState("");

  // User Data
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [postcode, setPostcode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dob, setDob] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [position, setPosition] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [DOBDay, setDOBDay] = useState("");
  const [DOBMonth, setDOBMonth] = useState("");
  const [DOBYear, setDOBYear] = useState("");
  const [bio, setBio] = useState("");
  const [title, setTitle] = useState("");
  const [submitError, setSubmitError] = useState(false);

  const selectedDate = new Date(`${DOBYear}-${DOBMonth}-${DOBDay}`);

  // Format the date as DD/MM/YYYY
  const formattedDate = `${selectedDate.getDate()}/${
    selectedDate.getMonth() + 1
  }/${selectedDate.getFullYear()}`;

  const { uid } = firebase.auth().currentUser;

  //  Create Profile Logic
  const addDataToFirestore = async (profPic) => {
    try {
      const collectionRef = firebase.firestore().collection("users").doc(uid);
      await collectionRef.set({
        firstName: firstName,
        surname: surname,
        gender: gender,
        location: location,
        postcode: postcode,
        phoneNumber: phoneNumber,
        DOB: selectedDate,
        jobTitle: jobTitle,
        positionRole: position,
        employmentType: employmentType,
        userId: uid,
        bio: bio,
        registeredBusiness: "",
        isManager: false,
        profPic: profPic,
        purchasedMods: [],
        accessibleMods: [],
        accountState: "",
        joinDate: "",
        notifications: [],
        settings: [],
        marketingEmails: false,
        signedGDPR: false,
        language: "eng",
        accessibility: [],
        lastLoggedIn: "",
        unisRole: "",
        hasCreatedProfile: true,
        // Add more fields as needed
      });
      console.log("Data added to Firestore");
      console.log(location);
    } catch (error) {
      console.error("Error adding data to Firestore:", error);
      setDispErr(true);
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
          addDataToFirestore(res);
          const { uid } = firebase.auth().currentUser;
          firebase
            .firestore()
            .collection("profPics")
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
              alert("Congratulations, you have created your profile!");
            })
            .catch((err) => {
              console.log("err", err);
            });
        });
        console.log("Uploaded a blob or file!");
        submitHandler();
      });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

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

  const profAtoBHandler = () => {
    setCreProfA(false);
    setCreProfB(true);
  };

  const goBackHandler1 = () => {
    setCreProfA(true);
    setCreProfB(false);
  };
  const goBackHandler2 = () => {
    setCreProfB(true);
    setCreProfC(false);
  };
  const goBackHandler3 = () => {
    setCreProfC(true);
    setCreProfD(false);
  };
  const goBackHandler4 = () => {
    setCreProfD(true);
    setCreProfE(false);
  };

  const profBtoCHandler = () => {
    setCreProfB(false);
    setCreProfC(true);
  };

  const profCtoDHandler = () => {
    setCreProfC(false);
    setCreProfD(true);
  };

  const profDtoEHandler = () => {
    setCreProfD(false);
    setCreProfE(true);
  };

  const submitHandler = () => {
    setCreProfE(false);
    setHasSubmitted(true);
  };

  const subErrHandler = () => {
    setSubmitError(true);
  };

  return (
    <View style={styles.screenStyle}>
      <Image
        source={{ uri: "https://i.imgur.com/vIhCAJH.png" }}
        style={{
          height: 70,
          width: 70,
          resizeMode: "contain",
          marginBottom: 20,
          marginTop: -160,
        }}
      />

      <View>
        <Text
          style={{
            marginBottom: 20,
            color: "white",
            fontWeight: "300",
            fontSize: 22,
          }}
        >
          Create Your{" "}
          <Text style={{ fontWeight: "700", color: COLORS.mainGreen }}>
            UNIS
          </Text>{" "}
          Profile
        </Text>
      </View>
      {/* Create Profile Card A */}
      {creProfA && (
        <View style={styles.cardStyle}>
          {/* First Name */}

          <TextInput
            style={styles.textInputStyle}
            placeholder="First Name"
            placeholderTextColor={"lightgrey"}
            value={firstName}
            onChangeText={(t) => setFirstName(t)}
          />

          {/* Surname */}
          <TextInput
            style={styles.textInputStyle}
            placeholder="Surname"
            placeholderTextColor={"lightgrey"}
            value={surname}
            onChangeText={(t) => setSurname(t)}
          />
          {/* Date of Birth */}
          <View style={{}}>
            <Text
              style={{ color: "lightgrey", fontSize: 18, textAlign: "center" }}
            >
              Date of Birth
            </Text>
            <View style={{ flexDirection: "row", alignSelf: "flex-start" }}>
              <TextInput
                style={[
                  styles.textInputStyle,
                  { width: 40, textAlign: "center", paddingLeft: 0 },
                ]}
                placeholder="DD"
                placeholderTextColor={"lightgrey"}
                maxLength={2}
                keyboardType="numeric"
                value={DOBDay}
                onChangeText={(t) => setDOBDay(t)}
              />
              <TextInput
                style={[
                  styles.textInputStyle,
                  {
                    width: 40,
                    marginHorizontal: 10,
                    textAlign: "center",
                    paddingLeft: 0,
                  },
                ]}
                placeholder="MM"
                placeholderTextColor={"lightgrey"}
                maxLength={2}
                keyboardType="numeric"
                value={DOBMonth}
                onChangeText={(t) => setDOBMonth(t)}
              />
              <TextInput
                style={[
                  styles.textInputStyle,
                  { width: 60, textAlign: "center", paddingLeft: 0 },
                ]}
                placeholder="YYYY"
                placeholderTextColor={"lightgrey"}
                maxLength={4}
                keyboardType="numeric"
                value={DOBYear}
                onChangeText={(t) => setDOBYear(t)}
              />
            </View>
          </View>
          <Pressable onPress={profAtoBHandler}>
            <Ionicons
              name="chevron-forward-circle"
              size={36}
              color={COLORS.mainGreen}
              style={{}}
            />
          </Pressable>
        </View>
      )}
      {/* Create Profile Card B */}
      {creProfB && (
        <View style={styles.cardStyle}>
          <TextInput
            style={styles.textInputStyle}
            placeholder="Location"
            placeholderTextColor={"white"}
            value={location}
            onChangeText={(t) => setLocation(t)}
          />

          {/* Surname */}
          <TextInput
            style={styles.textInputStyle}
            placeholder="Postcode"
            placeholderTextColor={"white"}
            value={postcode}
            onChangeText={(t) => setPostcode(t)}
          />
          {/* Phone Number*/}
          <TextInput
            style={styles.textInputStyle}
            placeholder="Phone Number"
            placeholderTextColor={"white"}
            keyboardType="numeric"
            value={phoneNumber}
            onChangeText={(t) => setPhoneNumber(t)}
          />
          <Pressable onPress={profBtoCHandler}>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={goBackHandler1}>
                <Ionicons
                  name="chevron-back-circle"
                  size={36}
                  color={COLORS.lightGreen}
                  style={{ marginRight: 5 }}
                />
              </TouchableOpacity>
              <Ionicons
                name="chevron-forward-circle"
                size={36}
                color={COLORS.mainGreen}
                style={{ marginLeft: 5 }}
              />
            </View>
          </Pressable>
        </View>
      )}
      {/* Create Profile Card C */}
      {creProfC && (
        <View style={styles.cardStyle}>
          {/* Gender */}
          <TextInput
            style={styles.textInputStyle}
            placeholder="Gender"
            placeholderTextColor={"white"}
            value={gender}
            onChangeText={(t) => setGender(t)}
          />

          {/* JobTitle */}
          <TextInput
            style={styles.textInputStyle}
            placeholder="Job Title"
            placeholderTextColor={"white"}
            value={jobTitle}
            onChangeText={(t) => setJobTitle(t)}
          />
          {/* Employment Type*/}
          <TextInput
            style={styles.textInputStyle}
            placeholder="Employment Type"
            placeholderTextColor={"white"}
            value={employmentType}
            onChangeText={(t) => setEmploymentType(t)}
          />
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity onPress={goBackHandler2}>
              <Ionicons
                name="chevron-back-circle"
                size={36}
                color={COLORS.lightGreen}
                style={{ marginRight: 5 }}
              />
            </TouchableOpacity>
            <Pressable onPress={profCtoDHandler}>
              <Ionicons
                name="chevron-forward-circle"
                size={36}
                color={COLORS.mainGreen}
                style={{}}
              />
            </Pressable>
          </View>
        </View>
      )}

      {/* Create Profile Row D */}
      {creProfD && (
        <Pressable onPress={Keyboard.dismiss} style={styles.cardStyle}>
          {/* Create Bio */}
          <TextInput
            style={[
              styles.textInputStyle,
              {
                height: 120,
              },
            ]}
            placeholder="Create Your Bio"
            placeholderTextColor={"white"}
            value={bio}
            onChangeText={(t) => setBio(t)}
            multiline
            textAlignVertical="top"
          />
          <Text
            style={{
              color: "grey",
              fontSize: 12,
              marginBottom: 20,
              marginTop: -10,
            }}
          >
            Enter a short description about yourself
          </Text>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity onPress={goBackHandler3}>
              <Ionicons
                name="chevron-back-circle"
                size={36}
                color={COLORS.lightGreen}
                style={{ marginRight: 5 }}
              />
            </TouchableOpacity>
            <Pressable onPress={profDtoEHandler}>
              <Ionicons
                name="chevron-forward-circle"
                size={36}
                color={COLORS.mainGreen}
                style={{}}
              />
            </Pressable>
          </View>
        </Pressable>
      )}

      {/* Create Profile Row E */}
      {creProfE && (
        <View style={styles.cardStyle}>
          <View>
            <Text style={{ color: "white", marginBottom: 10, fontSize: 18 }}>
              Select Profile Photo
            </Text>

            {!image && (
              <View
                source={{ uri: image }}
                style={{
                  height: 100,
                  width: 100,
                  borderRadius: 50,
                  borderWidth: 1,
                  borderColor: COLORS.mainGreen,
                  alignSelf: "center",
                  backgroundColor: COLORS.grey,
                }}
              />
            )}

            {image && (
              <Image
                source={{ uri: image }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  // marginTop: 20,
                  borderWidth: 1,
                  borderColor: COLORS.lightGreen,
                  alignSelf: "center",
                }}
              />
            )}

            <Pressable onPress={pickImage}>
              <MaterialIcons
                name="file-upload"
                size={48}
                color={COLORS.mainGreen}
                style={{ alignSelf: "center", marginTop: 15 }}
              />
              <Text
                style={{
                  color: "white",
                  marginBottom: 10,
                  textAlign: "center",
                }}
              >
                Choose Image
              </Text>
            </Pressable>
          </View>

          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity onPress={goBackHandler4}>
              <Ionicons
                name="chevron-back-circle"
                size={36}
                color={COLORS.lightGreen}
                style={{ marginRight: 5 }}
              />
            </TouchableOpacity>
            <Pressable
              onPress={
                firstName.length > 2 &&
                surname.length > 2 &&
                location.length > 2 &&
                bio.length > 2 &&
                phoneNumber.length > 2 &&
                jobTitle.length > 2
                  ? () =>
                      uploadImage(image, `${Date.now()}_photo`, "cards", title)
                  : () => setSubmitError(true)
              }
            >
              <Ionicons
                name="chevron-forward-circle"
                size={36}
                color={COLORS.mainGreen}
                style={{}}
              />
            </Pressable>
          </View>
          <Text style={{ color: "tomato", textAlign: "center" }}>
            Please ensure all fields are completed
          </Text>
        </View>
      )}

      {/* HAS SUBMITTED */}
      {hasSubmitted && (
        <View style={styles.cardStyle}>
          <Text
            style={{
              color: "white",
              marginBottom: 20,
              fontSize: 16,
              fontWeight: "300",
              textAlign: "center",
            }}
          >
            Congratulations, you've created your profile!
          </Text>
          <Pressable
            onPress={() => navigation.navigate("Home")}
            style={styles.gotToAppButtonStyle}
          >
            <Text style={{ fontWeight: "700" }}>Take me to the app</Text>
          </Pressable>
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
    justifyContent: "center",
    paddingTop: 30,
  },
  cardStyle: {
    // backgroundColor: COLORS.grey,
    paddingTop: 20,
    paddingHorizontal: 40,
    paddingBottom: 20,
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "white",
  },
  textInputStyle: {
    height: 50,
    width: 250,
    // borderRadius: 12,
    // backgroundColor: COLORS.black,
    fontWeight: "300",
    paddingLeft: 10,
    marginBottom: 20,
    fontSize: 18,
    color: COLORS.mainGreen,
    borderBottomWidth: 1,
    borderBottomColor: "white",
    // borderWidth: 1,
  },
  gotToAppButtonStyle: {
    backgroundColor: COLORS.mainGreen,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
});
