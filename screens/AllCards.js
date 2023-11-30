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
  Platform,
} from "react-native";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  FlipInEasyX,
  FlipInXUp,
  FadeIn,
  FlipInXDown,
  FlipOutEasyX,
  Easing,
  BounceIn,
} from "react-native-reanimated";
import EX_CARDS from "../misc/EX_CARDS";
import COLORS from "../misc/COLORS";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

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

export default function AllCards({ navigation }) {
  const [hasCards, setHasCards] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [data, setData] = useState("");
  const { uid } = firebase.auth().currentUser;
  const [contacts, setContacts] = useState("");

  const [hasExpanded, setHasExpanded] = useState(false);

  const [isVisible, setIsVisible] = useState(false);

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
    // Assume you have a timestamp from Firebase
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

  const calculateDaysDifference = (expiryDate) => {
    const currentDate = new Date();
    const expiryDateTime = expiryDate.toDate(); // Convert Firestore timestamp to JavaScript Date
    const timeDifference = expiryDateTime - currentDate;
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return daysDifference;
  };

  // FlatList Item Colours
  const myColors = [COLORS.grey, COLORS.lightGreen, COLORS.mainGreen];

  // FlatList
  const setShowModalHandler = () => {
    setShowModal((prevState) => !prevState);
  };

  const Item = ({ id, index, title, imageUrl, expiryDate, documentId }) => {
    const daysDifference = calculateDaysDifference(expiryDate);

    let statusText = "";
    if (daysDifference < 0) {
      statusText = "Expired";
    } else if (daysDifference <= 30) {
      statusText = "Expiring Soon";
    }

    return (
      <Animated.View style={animatedStyles}>
        <Pressable
          onPress={
            hasExpanded
              ? () =>
                  navigation.navigate("CardDisplay", {
                    title,
                    imageUrl,
                    // expiryDate,
                    statusText,
                    documentId,
                    // daysDifference,
                  })
              : handlePress
          }
          style={{}}
        >
          <ImageBackground
            source={{ uri: imageUrl }}
            style={{
              width: 320,
              height: 200,
              marginBottom: 20,
              justifyContent: "center",
              paddingLeft: 20,
            }}
            imageStyle={{ borderRadius: 12, borderWidth: 2 }}
          >
            <View style={{ alignSelf: "flex-end", marginRight: 20 }}></View>
            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "700",
                marginBottom: 20,
                marginTop: -50,
              }}
            >
              {/* {expiryDate?.toDate().toLocaleDateString("en-GB")} */}
              {title.toUpperCase()}
            </Text>
            <Text
              style={{
                color: "tomato",
                fontSize: 12,
                fontWeight: "700",
                marginBottom: 20,
              }}
            >
              {/* {expiryDate?.toDate().toLocaleDateString("en-GB")} */}
              {statusText}
            </Text>
          </ImageBackground>
        </Pressable>
      </Animated.View>
    );
  };

  const renderItem = ({ item }) => (
    <Item
      title={item.data.title}
      id={item.data.id}
      imageUrl={item.data.imageUrl}
      expiryDate={item.data.expiryDate}
      documentId={item.data.documentId}
    />
  );

  return (
    <Pressable
      onPress={hasExpanded ? shrinkPress : handlePress}
      style={styles.screenStyle}
    >
      <View style={{ alignItems: "center" }}>
        <View
          style={{
            // paddingTop: 320,
            marginHorizontal: 30,
          }}
        >
          {/* {!contacts && (
        <View>
          {isVisible && (
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
          )} */}
        </View>

        {/* Modal */}
        {/* {showModal && (
          <Animated.View style={{}}>
            <Pressable
              onPress={setShowModalHandler}
              style={{
                marginTop: 80,
                paddingVertical: 30,
                paddingHorizontal: 30,
                backgroundColor: "white",
                borderRadius: 12,
                padding: 20,
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: 22, fontWeight: "700" }}>
                  Card Title
                </Text>
                <MaterialIcons
                  name="verified-user"
                  size={24}
                  color={COLORS.mainGreen}
                  style={{ marginLeft: 10 }}
                />
              </View>

              <Image
                source={{
                  uri: "https://images.pexels.com/photos/2219035/pexels-photo-2219035.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                }}
                style={{
                  width: 300,
                  height: 200,
                  borderRadius: 22,
                  marginTop: 20,
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <Text
                  style={{
                    paddingLeft: 20,
                    marginRight: 20,
                    fontSize: 16,
                    fontWeight: "700",
                  }}
                >
                  CSCS Card
                </Text>
                <Text>
                  Expiry Date: <Text>13/12/2025</Text>
                </Text>
              </View>
              <View
                style={{
                  width: 300,
                  height: 2,
                  backgroundColor: "lightgrey",
                  marginTop: 10,
                }}
              />
              <Image
                source={{ uri: "https://i.imgur.com/rEVuNiG.png" }}
                style={{ height: 100, width: 100, marginTop: 20 }}
              />
              <Text style={{ fontWeight: "600" }}>Share this QR Code</Text>
            </Pressable>
          </Animated.View>
        )} */}

        {/* FlatList */}
        {contacts && !showModal && (
          <FlatList
            data={contacts}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => (
              <View style={{ marginBottom: 20 }}>
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

                <Pressable onPress={hasExpanded ? shrinkPress : handlePress}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: COLORS.mainGreen,
                      textAlign: "center",
                    }}
                  >
                    {hasExpanded ? "Close" : "Open"} Wallet
                  </Text>
                </Pressable>
              </View>
            )}
            ListFooterComponent={() => <View style={{ height: 160 }}></View>}
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
    </Pressable>
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
