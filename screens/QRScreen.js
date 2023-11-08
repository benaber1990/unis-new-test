import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Share,
  ScrollView,
} from "react-native";
import COLORS from "../misc/COLORS";

import QRCode from "react-native-qrcode-svg";
import firebase from "firebase/compat";
import { Entypo } from "@expo/vector-icons";

// import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/auth";
import UnisLogo from "../components/UnisLogo";

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

function QRScreen({ navigation }) {
  const [data, setData] = useState();
  const [qrCode, setQRCode] = useState("123");

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

  // Share By
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: "UNIS.One || This is my UNIS Profile",
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
          <QRCode
            value={data?.uid}
            size={250}
            backgroundColor={COLORS.mainGreen}
          />
        </View>
      )}
      <Text style={{ color: "white", marginTop: 10, fontWeight: "500" }}>
        Your Unique Unis QR
      </Text>

      {/* Share Profile Button */}

      <Pressable
        onPress={onShare}
        style={{
          padding: 20,
          marginTop: 20,
          backgroundColor: COLORS.grey,
          alignItems: "center",
          borderRadius: 6,
        }}
      >
        <Entypo name="share-alternative" size={32} color={COLORS.mainGreen} />
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

      <View style={{ marginTop: 60 }}>
        <Text
          style={{
            color: "white",
            fontWeight: "600",
            textAlign: "center",
            marginHorizontal: 40,
            // marginBottom: 40,
          }}
        >
          You can display your QR to employers to share your profile QR Code
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    backgroundColor: COLORS.black,
    flex: 1,
    alignItems: "center",
    // paddingTop: 60,
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
