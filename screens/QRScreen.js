import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Share,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import COLORS from "../misc/COLORS";
import { useIsFocused } from "@react-navigation/native";
import QRCode from "react-native-qrcode-svg";
import firebase from "firebase/compat";
import { Entypo, AntDesign, Ionicons } from "@expo/vector-icons";
import Animated, {
  PinwheelIn,
  PinwheelOut,
  RotateInDownLeft,
} from "react-native-reanimated";

// import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/auth";
import UnisLogo from "../components/UnisLogo";

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

function QRScreen({ navigation }) {
  const [data, setData] = useState();
  const [userData, setUserData] = useState("");
  const [qrCode, setQRCode] = useState("123");
  const { uid } = firebase.auth().currentUser;

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    // Cleanup the timeout to avoid memory leaks
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log("Yes!");
        setData(authUser);
        console.log(data?.uid.length);
      } else {
        // User is signed out.
        console.log("No");
      }
    });

    // Clean up the listener when the component unmounts.
    return unsubscribe;
  }, []);

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

      setUserData(snapshot?.data());
      console.log(uid);
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

  // Share By
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `See my Unis Profile at https://unis.one/profile/view/${uid}`,
        // message: "hello",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        paddingBottom: 60,
        backgroundColor: COLORS.black,
      }}
      showsVerticalScrollIndicator={false}
    >
      {userData && (
        <View style={styles.screenStyle}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "500",
              color: "white",
              marginBottom: 40,
            }}
          ></Text>
          <Text
            style={{
              marginBottom: 20,
              fontSize: 18,
              fontWeight: "500",
              color: "white",
            }}
          >
            Your Unique{" "}
            <Text style={{ color: COLORS.mainGreen, fontWeight: "700" }}>
              UNIS{" "}
            </Text>
            QR Code
          </Text>

          <View style={{ marginTop: 30 }} />

          {/* QR Code */}
          {data?.uid.length > 1 && (
            <View style={styles.cardStyle}>
              <View
                entering={RotateInDownLeft.duration(900)}
                exiting={RotateInDownLeft}
              >
                <QRCode
                  value={data?.uid}
                  size={200}
                  backgroundColor={COLORS.mainGreen}
                />
              </View>
            </View>
          )}
          <Text style={{ color: "white", marginTop: 10, fontWeight: "500" }}>
            The QR code that makes your job easier
          </Text>

          {/* Share Profile Button */}

          <View style={{ flexDirection: "row" }}>
            <Pressable
              onPress={onShare}
              style={{
                padding: 10,
                marginTop: 20,
                // backgroundColor: COLORS.grey,
                alignItems: "center",
                borderRadius: 6,
                marginRight: 10,
              }}
            >
              <Entypo
                name="share-alternative"
                size={28}
                color={COLORS.mainGreen}
              />
              <Text
                style={{
                  color: "white",
                  fontWeight: "600",
                  marginTop: 5,
                }}
              >
                Share My Profile
              </Text>
            </Pressable>

            {/* Scan QR Code */}

            <Pressable
              onPress={() => navigation.navigate("ScanQr")}
              style={{
                padding: 10,
                marginLeft: 10,
                marginTop: 20,
                // backgroundColor: COLORS.grey,
                alignItems: "center",
                borderRadius: 6,
              }}
            >
              <AntDesign name="scan1" size={28} color={COLORS.mainGreen} />
              <Text
                style={{
                  color: "white",
                  fontWeight: "600",
                  marginTop: 5,
                }}
              >
                Scan QR Code
              </Text>
            </Pressable>
          </View>

          {/* View Business Card */}
          <TouchableOpacity
            onPress={() => navigation.navigate("BusinessCard")}
            style={{ marginTop: 20, alignItems: "center" }}
          >
            <Ionicons name="globe-outline" size={32} color={COLORS.mainGreen} />
            <Text style={{ color: "white", fontWeight: "600", marginTop: 3 }}>
              See My Pass Card
            </Text>
          </TouchableOpacity>

          {/* Display Your QR Text */}
          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                color: "white",
                fontWeight: "600",
                textAlign: "center",
                marginTop: 20,
                marginBottom: 60,
                // marginBottom: 40,
              }}
            >
              You can display your QR to employers to share your profile QR Code
            </Text>
          </View>
        </View>
      )}

      {/* User Not Logged In */}
      {!userData && (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: COLORS.black,
            // paddingTop: 120,
          }}
        >
          <Image
            source={{ uri: "https://i.imgur.com/rDCre6r.png" }}
            style={{ height: 75, width: 75, resizeMode: "contain" }}
          />
          {isVisible && (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View style={{ alignItems: "center" }}>
                <Pressable
                  onPress={() => navigation.navigate("CreateProfileA")}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 6,
                    backgroundColor: COLORS.mainGreen,
                    marginVertical: 20,
                  }}
                >
                  <Text style={{ fontWeight: "700" }}>Complete Account</Text>
                </Pressable>
                <Text style={{ color: "white", textAlign: "center" }}>
                  Please complete your account for the full UNIS experience
                </Text>
              </View>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    backgroundColor: COLORS.black,
    flex: 1,
    alignItems: "center",
    paddingTop: 30,
  },
  cardStyle: {
    backgroundColor: COLORS.mainGreen,
    alignSelf: "center",
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderRadius: 8,
    paddingTop: 20,
  },
});

export default QRScreen;
