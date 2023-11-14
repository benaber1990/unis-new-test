import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Alert, Image } from "react-native";
import COLORS from "../misc/COLORS";
import { Ionicons, AntDesign, Feather, Octicons } from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";

import firebase from "firebase/compat";

// import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/auth";
import { useIsFocused } from "@react-navigation/native";
import { fetchCertificateImages } from "./helpers/helpers";
import ProfIcon from "../miscComps/ProfIcon";
import TextCardComp from "../miscComps/TextCardComp";

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

export default function DeleteDocumentConfirm({ route }) {
  const { title, imageUrl } = route.params;
  const { uid } = firebase.auth().currentUser;

  const navigationHndl = useNavigation();

  const createAlert = () =>
    Alert.alert("Document Deleted", "Your document has been deleted", [
      {
        text: "Okay",
        onPress: () => navigationHndl.navigate("AllDocuments"),
        style: "cancel",
      },
    ]);

  const deleteDocument = (documentId) => {
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .collection("certs")
      .doc(documentId)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
        createAlert();
        // Refresh the documents after deletion
        // fetchDocPics();
      })
      .catch((error) => {
        console.error("Error deleting document: ", error);
      });
  };

  return (
    <View style={styles.screenStyle}>
      <View style={{ marginHorizontal: 40 }}>
        <Text
          style={{
            color: "tomato",
            textAlign: "center",
            fontWeight: "700",
            marginBottom: 10,
          }}
        >
          Delete this document. Warning!
        </Text>
        <Text style={{ color: "tomato", textAlign: "center" }}>
          This process is irreversible. If you delete this document, you will
          not be able to retrieve it
        </Text>
      </View>

      <Image
        source={{ uri: imageUrl }}
        style={{
          alignSelf: "center",
          height: 200,
          width: 175,
          marginVertical: 20,
        }}
      />
      <Text
        style={{
          textAlign: "center",

          color: "lightgrey",
          fontSize: 18,
          fontWeight: "600",
          marginBottom: 20,
        }}
      >
        {title}
      </Text>

      <Pressable
        onPress={() => deleteDocument(title)}
        style={{
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 6,
          backgroundColor: "tomato",
        }}
      >
        <Text>Yes, confirm delete</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    backgroundColor: COLORS.black,
    alignItems: "center",
    paddingTop: 20,
  },
});
