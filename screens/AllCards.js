import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Button,
  Image,
  ScrollView,
  FlatList,
  ImageBackground,
} from "react-native";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";
import EX_CARDS from "../misc/EX_CARDS";
import COLORS from "../misc/COLORS";
import { Ionicons, AntDesign, Feather, Octicons } from "@expo/vector-icons";

// import firebase from "firebase/compat/app";
import firebase from "firebase/compat";
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

export default function AllCards({ navigation }) {
  const [hasCards, setHasCards] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [data, setData] = useState("");
  const { uid } = firebase.auth().currentUser;
  const [contacts, setContacts] = useState("");

  const [hasExpanded, setHasExpanded] = useState(false);

  // Animated
  const marginVal = useSharedValue(-60);

  function handlePress() {
    marginVal.value += 80;
    setHasExpanded(true);
  }

  function shrinkPress() {
    marginVal.value = -60;

    setHasExpanded(false);
  }

  const animatedStyles = useAnimatedStyle(() => ({
    marginBottom: withSpring(marginVal.value * 2),
  }));

  // Firebase User Info
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
      // console.log(user.uid);
    });

    return () => unsubscribe();
  }, []);

  // Fetch User Data
  const isFocused = useIsFocused();

  // Fetch Cards
  const fetchDocPics = () => {
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .collection("cards")
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

  const openModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  // FlatList Item Colours
  const myColors = [COLORS.grey, COLORS.lightGreen, COLORS.mainGreen];

  // FlatList
  const Item = ({ id, index, title, imageUrl }) => {
    return (
      <Animated.View
        style={[
          {
            //   marginBottom: 20,
          },
          animatedStyles,
        ]}
      >
        <Pressable
          onPress={() =>
            navigation.navigate("CardDisplay", {
              title: title,
              imageUrl: imageUrl,
              expiryDate: "123",
            })
          }
          style={{
            width: 350,
            height: 250,
            marginBottom: 20,
            padding: 30,
            justifyContent: "center",
            backgroundColor: COLORS.grey,
            borderWidth: 4,
            borderColor: COLORS.mainGreen,
            borderRadius: 22,
          }}
        >
          <Text style={{ color: "white", fontSize: 18, fontWeight: "700" }}>
            {title}
          </Text>
        </Pressable>
      </Animated.View>
    );
  };

  const renderItem = ({ item }) => (
    <Item
      title={item.data.title}
      id={item.data.id}
      imageUrl={item.data.imageUrl}
    />
  );

  return (
    <View style={styles.screenStyle}>
      <View style={{ alignItems: "center" }}>
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
              'Upload Card' to get started
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
              <View style={{ marginBottom: 30 }}>
                <Pressable
                  onPress={() => navigation.navigate("AddNewCard")}
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
                      fontSize: 16,
                      fontWeight: "500",
                    }}
                  >
                    Upload New Card
                  </Text>
                </Pressable>

                {!hasExpanded ? (
                  <Pressable
                    onPress={handlePress}
                    style={{
                      backgroundColor: COLORS.lightGreen,
                      paddingVertical: 15,
                      paddingHorizontal: 25,
                      borderRadius: 6,
                      alignSelf: "center",
                    }}
                  >
                    <Text>Expand Cards</Text>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={shrinkPress}
                    style={{
                      backgroundColor: COLORS.lightGreen,
                      paddingVertical: 15,
                      paddingHorizontal: 25,
                      borderRadius: 6,
                      alignSelf: "center",
                    }}
                  >
                    <Text>Close Cards</Text>
                  </Pressable>
                )}
              </View>
            )}
            ListFooterComponent={() => <View style={{ height: 160 }} />}
          />
        )}

        <View style={{ alignItems: "center" }}>
          {/* {contacts &&
              contacts.map((i) => (
                <Pressable
                  onPress={() =>
                    navigation.navigate("CardDisplay", {
                      imageUrl: i.data.imageUrl,
                      title: i.data.title,
                      expiryDate: i.data.expiryDate,
                    })
                  }
                  key={i.data.imageUrl}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 30,
                    padding: 20,
                    backgroundColor: COLORS.grey,
                    borderRadius: 12,
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
                    <Text
                      style={{
                        color: "white",
                        fontSize: 14,
                        fontWeight: "300",
                      }}
                    >
                      Expiry Date: {i.data.expiryDate}
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
  itemStyle: {
    width: 300,
    backgroundColor: COLORS.lightGreen,
    marginBottom: 20,
    paddingLeft: 20,
    paddingTop: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    height: 150,
    marginTop: -60,
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
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: COLORS.mainGreen,
    marginBottom: 30,
    alignSelf: "center",
    marginTop: 20,
    alignItems: "center",
    flexDirection: "row",
  },
});
