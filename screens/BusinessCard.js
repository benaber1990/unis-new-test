import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Image,
  PermissionsAndroid,
  Linking,
} from "react-native";
import COLORS from "../misc/COLORS";
import { FontAwesome } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";
import { useIsFocused } from "@react-navigation/native";
import Contacts from "react-native-contacts";

// IMPORT FIREBASE
import firebase from "firebase/compat";
import "firebase/compat/database";
import "firebase/auth";

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

export default function BusinessCard() {
  const [data, setData] = useState();
  const isFocused = useIsFocused();

  const { uid } = firebase.auth().currentUser;

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

  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
    title: "Contacts",
    message: "This app would like to view your contacts.",
    buttonPositive: "Please accept bare mortal",
  })
    .then((res) => {
      console.log("Permission: ", res);
      Contacts.getAll()
        .then((contacts) => {
          // work with contacts
          console.log(contacts);
        })
        .catch((e) => {
          console.log(e);
        });
    })
    .catch((error) => {
      console.error("Permission error: ", error);
    });

  // CARD
  const handleDownload = () => {
    const contactURL = `tel:${"01234567"}`;

    Linking.openURL(contactURL)
      .then(() => console.log("Opened contacts app"))
      .catch((error) => console.error("Error opening contacts app:", error));
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `My Business Card ${data?.firstName} || Powered by UNIS`,
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
      Alert.alert("error", error);
    }
  };

  return (
    <View style={styles.screenStyle}>
      <Animated.View entering={FadeIn.duration(1200)}>
        <View style={styles.cardStyle}>
          {/* Top Row */}
          <View
            style={{
              flexDirection: "row",
              marginTop: 20,
              marginBottom: 30,
              justifyContent: "space-between",
              marginHorizontal: 15,
            }}
          >
            <View />
            <TouchableOpacity
              onPress={onShare}
              style={{
                flexDirection: "row",
                alignItems: "center",
                alignSelf: "flex-end",
              }}
            >
              <FontAwesome
                name="send"
                size={16}
                color="white"
                style={{ marginRight: 6 }}
              />
              <Text style={{ color: "white", fontWeight: "700" }}>
                Send Card
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: 150,
              width: 150,
              backgroundColor: "white",
              alignSelf: "center",
              borderRadius: 12,
              marginBottom: 6,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
            }}
          >
            {/* QR */}
            <Image
              source={{
                uri: "https://i.imgur.com/rEVuNiG_d.jpg?maxwidth=520&shape=thumb&fidelity=high",
              }}
              style={{
                height: 140,
                width: 140,
                borderColor: "white",
                borderWidth: 2,
                padding: 20,
                borderRadius: 12,
                backgroundColor: "white",
              }}
            />
          </View>
          <Text
            style={{
              color: "white",
              //   marginVertical: 20,
              fontSize: 12,
              textAlign: "center",
              marginBottom: 20,
              // fontWeight: "700",

              //   marginTop: 6,
            }}
          >
            Show your QR to other UNIS users
          </Text>

          {/* Info Section Top */}
          <View
            style={{
              width: 300,
              alignItems: "center",
              backgroundColor: "white",
              borderBottomLeftRadius: 12,
              borderBottomRightRadius: 12,
              padding: 20,
              marginTop: -6,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View>
                <Text style={{ fontWeight: "700", fontSize: 16 }}>
                  {data?.firstName} {data?.surname}
                </Text>
                <Text style={{ padding: 2 }}>
                  {data?.positionRole} at {data?.companyName}
                </Text>
              </View>

              <View style={{ marginLeft: 30 }}>
                <Image
                  source={{
                    uri: data?.profPic,
                  }}
                  style={{ height: 50, width: 50, borderRadius: 6 }}
                />
              </View>
            </View>
            <View
              style={{
                width: 200,
                height: 2,
                backgroundColor: "lightgrey",
                alignSelf: "center",
                marginTop: 10,
              }}
            />

            {/* Info Section Bottom  */}
            <View style={{ marginTop: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ width: 20 }}>
                  <FontAwesome
                    name="envelope-o"
                    size={14}
                    color="grey"
                    style={{}}
                  />
                </View>
                <Text style={{}}>{data?.emailAddress}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 3,
                  alignItems: "center",
                }}
              >
                <View style={{ width: 20 }}>
                  <FontAwesome name="phone" size={14} color="grey" style={{}} />
                </View>
                <Text style={{ marginTop: 1 }}>{data?.phoneNumber}</Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleDownload}
          style={{
            backgroundColor: COLORS.mainGreen,
            alignSelf: "center",
            marginTop: 40,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 6,
          }}
        >
          <Text style={{ fontWeight: "700" }}>Download Card</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 3 }}>
          <Text
            style={{
              color: "white",
              fontSize: 12,
              textAlign: "center",
              marginTop: 6,
            }}
          >
            Learn more about your card
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    alignItems: "center",
    paddingTop: 120,
    // backgroundColor: "#f0f0f0",
    backgroundColor: COLORS.black,
  },
  cardStyle: {
    // backgroundColor: COLORS.grey,
    borderRadius: 16,
    marginTop: -80,
    borderWidth: 1,
    borderColor: "white",
  },
});
