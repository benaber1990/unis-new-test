import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import COLORS from "../misc/COLORS";
import firebase from "firebase/compat";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";

// import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/auth";
import LogInErrMsg from "../miscComps/LogInErrMsg";

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

export default function ScanQrDisplay({ route }) {
  const { userData } = route.params;
  //   const [firstName, setFirstName] = useState("");
  //   const [surname, setSurname] = useState("");
  //   const [gender, setGender] = useState("");
  //   const [location, setLocation] = useState("");
  //   const [postcode, setPostcode] = useState("");
  //   const [phoneNumber, setPhoneNumber] = useState("");
  //   const [dob, setDob] = useState("");
  //   const [jobTitle, setJobTitle] = useState("");
  //   const [position, setPosition] = useState("");
  //   const [employmentType, setEmploymentType] = useState("");
  //   const [bio, setBio] = useState("");
  //   const [DOBDay, setDOBDay] = useState("");
  //   const [DOBMonth, setDOBMonth] = useState("");
  //   const [DOBYear, setDOBYear] = useState("");
  //   const [subMsg, setSubMsg] = useState(false);

  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [dispErr, setDispErr] = useState(false);

  const fetchData = async () => {
    try {
      const collectionRef = firebase
        .firestore()
        .collection("users")
        .doc(userData);
      const snapshot = await collectionRef.get();
      const fetchedData = snapshot.data();

      if (fetchedData) {
        setData(fetchedData);
        console.log(fetchedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const LabelItem = ({ label, title }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
      }}
    >
      <Text
        style={{ fontSize: 16, fontWeight: "300", color: COLORS.lightGreen }}
      >
        {label}:{" "}
      </Text>
      <Text
        style={{ fontSize: 18, color: COLORS.mainGreen, fontWeight: "700" }}
      >
        {title}
      </Text>
    </View>
  );

  return (
    <View style={styles.screenStyle}>
      {/* Information */}

      {data && (
        <Image
          source={{ uri: data?.profPic }}
          style={{
            height: 100,
            width: 100,
            borderRadius: 50,
            borderWidth: 2,
            borderColor: COLORS.lightGreen,
            marginBottom: 40,
          }}
        />
      )}

      {data && (
        <View style={{ alignItems: "flex-start" }}>
          <LabelItem label="First Name" title={data?.firstName} />
          <LabelItem label="Surname" title={data?.surname} />
          <LabelItem label="Location" title={data?.location} />
          <LabelItem label="First Name" title={data?.firstName} />
          <LabelItem label="Phone Number" title={data?.phoneNumber} />
        </View>
      )}

      <Pressable>
        <Text>Save this Profile to my Dashboard</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.black,
    paddingTop: 20,
  },
});
