import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Dimensions,
} from "react-native";
import COLORS from "../misc/COLORS";
import {
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

import firebase from "firebase/compat";

// import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/auth";
import { useIsFocused } from "@react-navigation/native";

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

const windowWidth = Dimensions.get("window").width;

export default function CardDisplay({ navigation, route }) {
  const {
    title,
    imageUrl,
    expiryDate,
    statusText,
    daysDifference,
    documentId,
  } = route.params;

  const [isBack, setIsBack] = useState(false);
  const [content, setContent] = useState();

  const [data, setData] = useState("");
  const [newData, setNewData] = useState("");
  const { uid } = firebase.auth().currentUser;
  const [backUrl, setBackUrl] = useState();

  const isFocused = useIsFocused();

  const fetchData = async () => {
    try {
      const { uid } = firebase.auth().currentUser;
      if (!uid) return;
      const collectionRef = firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .collection("cards")
        .doc(documentId);
      const snapshot = await collectionRef.get();
      // console.log("snapshotdata", snapshot?.data());
      // const fetchedData = snapshot.docs.map((doc) => ({
      //   id: doc.id,
      //   ...doc.data(),
      // }));
      // console.log("fetchedData", snapshot?.data());

      setData(snapshot?.data());
      console.log("DATA", snapshot?.data());
      setBackUrl(data.backImageUrl);

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

  const SquareItem = ({ title, text, bckCol }) => (
    <View
      style={{
        width: 80,
        height: 80,
        borderRadius: 6,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: bckCol,
        marginHorizontal: 10,
        marginTop: 10,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "600" }}>{title}</Text>
      <Text style={{ marginTop: 6, fontSize: 12 }}>{text}</Text>
    </View>
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.black }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.screenStyle}>
        <View style={{ flex: 1 }}>
          <View style={{ marginHorizontal: 30 }}>
            {data && (
              <Image
                style={{
                  width: "100%",
                  height: 200,
                  marginBottom: 10,
                  borderRadius: 18,
                  borderWidth: 1,
                  borderColor: COLORS.mainGreen,
                }}
                source={{ uri: isBack ? data?.backImageUrl : imageUrl }}
              />
            )}

            <TouchableOpacity
              style={{ alignSelf: "center" }}
              onPress={() => setIsBack((prevState) => !prevState)}
            >
              <MaterialIcons
                name="flip-camera-android"
                size={32}
                color={COLORS.mainGreen}
                style={{ alignSelf: "center" }}
              />
            </TouchableOpacity>

            {/* Information Card */}
            <View
              style={{
                width: 300,
                height: 200,
                backgroundColor: "white",
                borderRadius: 12,
                alignItems: "center",
                paddingVertical: 20,
                alignSelf: "center",
                marginTop: 20,
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "700", marginBottom: 8 }}
              >
                {title}
              </Text>
              <Text>
                Days Until Expiry: <Text>84</Text>
              </Text>
            </View>
          </View>
        </View>
        <View style={{ alignItems: "center", marginTop: 60 }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("AddCardBack", {
                documentId,
              })
            }
          >
            <Text
              style={{
                color: "lightgrey",
                fontSize: 16,
                fontWeight: "300",
                marginBottom: 30,
              }}
            >
              Add Back Image
            </Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text
              style={{
                color: "lightgrey",
                fontSize: 16,
                fontWeight: "300",
              }}
            >
              Delete this card
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    // flex: 1,
    backgroundColor: COLORS.black,
  },
});
