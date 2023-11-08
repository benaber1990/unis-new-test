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

function AllDocuments({ navigation }) {
  const [hasCards, setHasCards] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

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

  // Fetch Document Images
  const fetchDocPics = () => {
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .collection("certs")
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
  const Item = ({ title, imageUrl }) => (
    <Pressable
      onPress={() =>
        navigation.navigate("DocumentDisplay", {
          title,
          imageUrl,
        })
      }
      style={{
        marginBottom: 60,
        alignSelf: "center",
      }}
    >
      <Image source={{ uri: imageUrl }} style={{ height: 250, width: 200 }} />
      <Text style={{ color: "white", marginTop: 10, fontSize: 18 }}>
        {title}
      </Text>
    </Pressable>
  );

  const renderItem = ({ item }) => (
    <Item title={item.data.title} imageUrl={item.data.imageUrl} />
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
          {!contacts && (
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
          )}
        </View>

        {/* FlatList */}
        {contacts && (
          <FlatList
            data={contacts}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => (
              <View>
                <Pressable
                  onPress={() => navigation.navigate("AddNewDocument")}
                  style={styles.buttonStyle}
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={24}
                    color="black"
                    style={{ marginRight: 10 }}
                  />
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 18,
                      fontWeight: "500",
                    }}
                  >
                    Upload Certificate
                  </Text>
                </Pressable>
              </View>
            )}
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

export default AllDocuments;
