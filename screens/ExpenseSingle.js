import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import COLORS from "../misc/COLORS";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";

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

export default function ExpenseSingle({ route, navigation }) {
  const { title, imageUrl, documentId } = route.params;
  const { uid } = firebase.auth().currentUser;

  const navigationHndl = useNavigation();

  const deleteDocument = () => {
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .collection("receipts")
      .doc(documentId)
      .delete()
      .then(() => {
        alert("Receipt Deleted Successfully");
        navigationHndl.navigate("ExpensesDisplay", {
          selectedDate: "",
        });
      })
      .catch((error) => {
        console.error("Error deleting document: ", error);
      });
  };

  return (
    <View style={styles.screenStyle}>
      {/* INSERT IMAGE HERE */}

      <Image
        source={{ uri: imageUrl }}
        style={{
          height: 300,
          width: 300,
          borderWidth: 2,
          borderColor: "white",
        }}
      />
      <Text
        style={{
          color: "white",
          fontSize: 20,
          marginVertical: 10,
          marginTop: 20,
          fontWeight: "700",
        }}
      >
        {title}
      </Text>
      <Text style={{ color: "white", fontSize: 18 }}>Date</Text>

      <TouchableOpacity onPress={deleteDocument}>
        <Text style={{ color: "darkgrey", fontSize: 16, marginTop: 80 }}>
          Remove Receipt
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    backgroundColor: COLORS.black,
    alignItems: "center",
  },
});
