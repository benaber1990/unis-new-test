import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
  ScrollView,
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

export default function CardDisplay({ navigation, route }) {
  const { title, imageUrl, expiryDate, statusText, daysDifference } =
    route.params;

  const [isBack, setIsBack] = useState(false);

  const [data, setData] = useState("");
  const { uid } = firebase.auth().currentUser;

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
        .doc(title);
      const snapshot = await collectionRef.get();
      // console.log("snapshotdata", snapshot?.data());
      // const fetchedData = snapshot.docs.map((doc) => ({
      //   id: doc.id,
      //   ...doc.data(),
      // }));
      // console.log("fetchedData", snapshot?.data());

      setData(snapshot?.data());
      console.log("DATA", snapshot?.data());
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

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.black }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.screenStyle}>
        <View
          style={{
            // height: 170,
            backgroundColor: COLORS.mainGreen,
            borderBottomRightRadius: 120,
            borderBottomLeftRadius: 120,
            paddingTop: 20,
            paddingBottom: 30,
          }}
        >
          <View style={{ marginHorizontal: 30 }}>
            <Image
              style={{
                width: "100%",
                height: 200,
                marginBottom: 15,
                borderRadius: 18,
                borderWidth: 3,
                borderColor: COLORS.black,
              }}
              source={{ uri: isBack ? data?.backImageProfilePic : imageUrl }}
            />

            <TouchableOpacity
              onPress={() => setIsBack((prevState) => !prevState)}
            >
              <MaterialIcons
                name="flip-camera-android"
                size={32}
                color={COLORS.black}
                style={{ alignSelf: "center" }}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Row B */}
        <View
          style={{
            marginTop: 40,
            paddingTop: 20,
            backgroundColor: COLORS.grey,
            flex: 1,
            borderTopLeftRadius: 60,
            paddingHorizontal: 30,
            borderTopRightRadius: 60,
            borderBottomRightRadius: 60,
            borderBottomLeftRadius: 60,
            marginBottom: 40,
            marginHorizontal: 20,
          }}
        >
          <Text
            style={{
              color: "white",
              marginLeft: 20,
              marginBottom: 10,
              fontWeight: "700",
              fontSize: 18,
            }}
          >
            Card Information
          </Text>
          <Text
            style={{
              color: "white",
              marginLeft: 20,
              marginBottom: 10,
              fontWeight: "700",
              // fontSize: 18,
            }}
          >
            Days until Expiry: {daysDifference}
          </Text>
          <Text
            style={{
              color: "tomato",
              marginLeft: 20,
              marginBottom: 10,
              fontWeight: "700",
              // fontSize: 18,
            }}
          >
            {statusText}
          </Text>

          <View
            style={{
              paddingHorizontal: 30,
              paddingVertical: 15,
              backgroundColor: COLORS.grey,
              width: 200,
              alignSelf: "center",
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontWeight: "700",
                fontSize: 18,
              }}
            >
              {title}
            </Text>
          </View>
          <Text
            style={{
              color: "white",
              marginTop: 20,
              textAlign: "center",
            }}
          >
            Expiry Date: <Text style={{ fontWeight: "700" }}>{expiryDate}</Text>
          </Text>

          <Pressable
            style={{ padding: 20, flexDirection: "row", alignItems: "center" }}
            onPress={() =>
              navigation.navigate("DeleteCardConfirm", { title, imageUrl })
            }
          >
            <Ionicons
              name="ios-trash-bin-outline"
              size={14}
              color="lightgrey"
              style={{ marginRight: 5 }}
            />
            <Text style={{ color: "lightgrey", fontWeight: "700" }}>
              Delete Card
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
});
