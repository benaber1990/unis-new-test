import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Animated,
  Button,
  Image,
  ScrollView,
  FlatList,
} from "react-native";
import EX_CARDS from "../misc/EX_CARDS";
import COLORS from "../misc/COLORS";
import { Ionicons, AntDesign, Feather, Octicons } from "@expo/vector-icons";

import firebase from "firebase/compat";

// import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/auth";
import { useIsFocused } from "@react-navigation/native";
import { fetchCertificateImages } from "./helpers/helpers";
import ProfIcon from "../miscComps/ProfIcon";
import TextCardComp from "../miscComps/TextCardComp";

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

function PermitsScreen({ navigation }) {
  const [hasCards, setHasCards] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [hasCompleted, setHasCompleted] = useState(false);

  const [data, setData] = useState("");
  const { uid } = firebase.auth().currentUser;
  const [contacts, setContacts] = useState("");

  // Firebase User Info
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
      console.log(user.uid);
    });

    return () => unsubscribe();
  }, []);

  // Fetch User Data
  const isFocused = useIsFocused();

  // Fetch Document
  const fetchDocPics = () => {
    firebase
      .firestore()
      .collection("adminNotifications")
      .doc(uid)
      .collection("Permits")
      .get()
      .then((querySnapshot) => {
        const contactsArray = [];
        querySnapshot.forEach((doc) => {
          contactsArray.push({
            data: doc.data(),
          });
        });
        setContacts(contactsArray);
        console.log("success!", contacts);
      });
  };

  useEffect(() => {
    fetchDocPics();
  }, [isFocused]);

  // FlatList
  const Item = ({
    title,
    videoLink,
    infoHere,
    hasCompleted,
    category,
    imgLink,
  }) => (
    <Pressable
      onPress={() =>
        navigation.navigate("PermitDisplay", {
          title,
          videoLink,
          infoHere,
          hasCompleted,
          category: "category",
          imgLink: "imgLink",
        })
      }
      style={{
        marginBottom: 30,
        alignSelf: "center",
        backgroundColor: COLORS.grey,
        padding: 20,
        width: 300,
        borderRadius: 8,
      }}
    >
      <Text
        style={{
          color: "white",
          marginTop: 10,
          fontWeight: "700",
          fontSize: 14,
        }}
      >
        Permit
      </Text>
      <Text style={{ color: "white", marginTop: 10, fontSize: 18 }}>
        {title}
      </Text>

      {hasCompleted && (
        <View>
          <Text
            style={{
              color: COLORS.mainGreen,
              marginTop: 10,
              fontWeight: "700",
              fontSize: 12,
            }}
          >
            You have accepted this Permit
          </Text>
        </View>
      )}
    </Pressable>
  );

  const renderItem = ({ item }) => (
    <Item
      title={item.data.title}
      videoLink={item.data.videoLink}
      infoHere={item.data.infoHere}
      hasCompleted={item.data.hasCompleted}
      imgLink={item.data.imgLink}
      category={item.data.category}
    />
  );

  return (
    <View style={styles.screenStyle}>
      <View style={{ alignItems: "center" }}>
        {/* No Certs */}

        <View
          style={{
            // paddingTop: 320,
            marginHorizontal: 30,
          }}
        >
          {/* {!contacts && (
            <Text
              style={{
                color: COLORS.lightGreen,
                textAlign: "center",
                fontSize: 16,
              }}
            >
              It looks like you don't have any certificates saved yet. Click
              'Upload Certificate' to get started
            </Text>
          )} */}
        </View>

        {/* FlatList */}
        {contacts && (
          <FlatList
            data={contacts}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => <View style={{ paddingTop: 20 }}></View>}
          />
        )}

        <View style={{ marginHorizontal: 20 }}>
          {/* {contacts &&
              contacts.map((i) => (
                <Pressable
                  onPress={() =>
                    navigation.navigate("DocumentDisplay", {
                      imageUrl: i.data.imageUrl,
                      title: i.data.title,
                    })
                  }
                  key={i.data.imageUrl}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 30,
                  }}
                >
                  <Image
                    source={{ uri: i.data.imageUrl }}
                    style={{
                      height: 100,
                      width: 100,
                      marginRight: 20,
                      borderRadius: 4,
                    }}
                  />
                  <View style={{ width: 200 }}>
                    <Text
                      style={{
                        color: "white",
                        fontSize: 22,
                        fontWeight: "600",
                      }}
                    >
                      {i.data.title}
                    </Text>
                  </View>
                </Pressable>
              ))} */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    alignItems: "center",
    // paddingTop: 60,
    backgroundColor: COLORS.black,
  },
  modalCardItemStyle: {
    backgroundColor: COLORS.lightGreen,
    width: 320,
    height: 200,
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 20,
    marginBottom: 10,
    marginTop: 10,
    borderWidth: 2,
  },
  buttonStyle: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 6,
    backgroundColor: COLORS.mainGreen,
    marginBottom: 30,
    alignSelf: "center",
    marginTop: 40,
    alignItems: "center",
    flexDirection: "row",
  },
});

export default PermitsScreen;
