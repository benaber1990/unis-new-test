import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import COLORS from "../misc/COLORS";
import Checkbox from "expo-checkbox";
import { useNavigation } from "@react-navigation/native";

// Import Firebase
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

export default function PermitDisplay({ navigation, route }) {
  const { title, videoLink, infoHere, hasCompleted, category, imgLink } =
    route.params;
  const [isChecked, setChecked] = useState(false);
  const [text, setText] = useState("");

  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();

  const [isCompleted, setIsCompleted] = useState(false);

  const navigationHndl = useNavigation();

  const { uid } = firebase.auth().currentUser;

  // Alert
  const createAlert = () =>
    Alert.alert(
      "Induction Completed!",
      `Congratulations, you've completed the ${title} induction`,
      [
        {
          text: "Okay",
          onPress: () => navigationHndl.navigate("PermitsScreen"),
          style: "cancel",
        },
      ]
    );

  // Firebase User Info
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
      console.log(uid);
    });

    return () => unsubscribe();
  }, []);

  // Mark As Complete
  const markAsComplete = async (documentId) => {
    try {
      const collectionRef = firebase
        .firestore()
        .collection("adminNotifications")
        .doc(uid)
        .collection("Permits")
        .doc(documentId);
      // .collection("UserData");
      await collectionRef.set({
        hasCompleted: true,
        title: title,
        videoLink: videoLink,
        infoHere: infoHere,
        category,
        imgLink,
        compDate: new Date(),
      });
      console.log("Data added to Firestore:");
      createAlert();
    } catch (error) {
      console.error("Error adding data to Firestore:", error);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.black }}
      showsVerticalScrollIndicator={false}
    >
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <View style={styles.screenStyle}>
          {/* Permit Title */}
          <View>
            <Text
              style={{
                color: COLORS.mainGreen,
                fontSize: 18,
                fontWeight: "700",
                // marginBottom: 20,
              }}
            >
              Permit Title:
              <Text style={{ color: "white" }}> Permit Title Here</Text>
            </Text>
          </View>

          {/* View Full Pemit Link */}
          <View>
            {/* <Pressable style={styles.buttonStyleChecked}>
            <Text style={{ fontSize: 16, fontWeight: "700" }}>
              View Full Permit
            </Text>
          </Pressable> */}
          </View>

          {/* Permit Image */}
          <Pressable
            onPress={() =>
              navigation.navigate("PermitSingle", {
                title: "Permit Title",
                category: "Category",
                imgLink:
                  "https://images.pexels.com/photos/271667/pexels-photo-271667.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
              })
            }
          >
            <Image
              source={{
                uri: "https://images.pexels.com/photos/271667/pexels-photo-271667.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
              }}
              style={{
                width: 300,
                height: 200,
                borderRadius: 6,
                marginVertical: 20,
              }}
            />
          </Pressable>

          {/* --- Permit Acceptance --- */}
          <View style={styles.permitAcceptanceCard}>
            <View>
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: "700",
                  marginBottom: 20,
                }}
              >
                Permit Acceptance
              </Text>
            </View>

            {/* Sign Name Text Input */}
            <View>
              <TextInput
                style={styles.textInputStyle}
                placeholder="Type Your Full Name Here"
                placeholderTextColor="lightgrey"
                value={text}
                onChangeText={(t) => setText(t)}
              />
            </View>

            {/* Date */}
            <View style={{ marginTop: 30 }}>
              <Text
                style={{
                  color: COLORS.lightGreen,
                  fontSize: 16,
                  fontWeight: "700",
                }}
              >
                Signed Date: {dd}.{mm}.{yyyy}
              </Text>
            </View>

            {/* Time */}

            {/* Checkbox */}
            <View
              style={{
                flexDirection: "row",
                marginHorizontal: 40,
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <Checkbox
                style={{ marginRight: 10 }}
                value={isChecked}
                onValueChange={setChecked}
                color={isChecked ? COLORS.mainGreen : COLORS.lightGreen}
              />
              <Text
                style={{
                  color: COLORS.lightGreen,
                  fontWeight: "600",
                }}
              >
                I confirm I've received, read and understand the pemit above
              </Text>
            </View>

            {/* Submit Button */}
            <View>
              <Pressable
                onPress={() => markAsComplete("example 1 title here")}
                style={styles.buttonStyleChecked}
              >
                <Text style={{ fontSize: 16, fontWeight: "700" }}>
                  Save and Submit
                </Text>
              </Pressable>
            </View>
          </View>

          {/*  */}
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
    backgroundColor: COLORS.black,
  },
  textInputStyle: {
    backgroundColor: COLORS.black,
    height: 60,
    width: 300,
    borderRadius: 8,
    color: "white",
    fontSize: 16,
    paddingLeft: 15,
    // fontWeight: "600",
  },
  buttonStyleUnchecked: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 4,
    backgroundColor: COLORS.lightGreen,
    marginTop: 15,
  },
  buttonStyleChecked: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 4,
    backgroundColor: COLORS.mainGreen,
    marginTop: 15,
  },
  permitAcceptanceCard: {
    backgroundColor: COLORS.grey,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
});
