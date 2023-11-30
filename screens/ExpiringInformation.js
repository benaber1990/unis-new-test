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
  Dimensions,
} from "react-native";
import EX_CARDS from "../misc/EX_CARDS";
import COLORS from "../misc/COLORS";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

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

const windowWidth = Dimensions.get("window").width;

const tempPic =
  "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

const ExpiringInformation = ({ navigation }) => {
  const [hasCards, setHasCards] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [data, setData] = useState("");
  const { uid } = firebase.auth().currentUser;
  const [contacts, setContacts] = useState("");

  const [hasExpanded, setHasExpanded] = useState(false);

  const [isVisible, setIsVisible] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    // Cleanup the timeout to avoid memory leaks
    return () => clearTimeout(timeoutId);
  }, []);

  // Firebase User Info
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
      // console.log(user.uid);
    });

    return () => unsubscribe();
  }, []);

  const [documents, setDocuments] = useState([]);

  const fetchDocuments = () => {
    const certsPromise = firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .collection("certs")
      .get()
      .then((querySnapshot) => {
        return querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
      });

    const cardsPromise = firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .collection("cards")
      .get()
      .then((querySnapshot) => {
        return querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
      });

    const notificationsPromise = firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .collection("notifications")
      .get()
      .then((querySnapshot) => {
        return querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
      });

    Promise.all([certsPromise, cardsPromise, notificationsPromise])
      .then(([certsData, cardsData, notificationsPromise]) => {
        const mergedDocuments = [
          ...certsData,
          ...cardsData,
          ...notificationsPromise,
        ];

        const visibleDocuments = mergedDocuments.filter(
          (doc) => !doc.data.hideNot
        );

        setDocuments(visibleDocuments);
        console.log("success!", visibleDocuments);
      })
      .catch((error) => {
        console.error("Error fetching documents:", error);
      });
  };

  useEffect(() => {
    fetchDocuments();
  }, [isFocused]);

  // HIDE NOTIFICATION
  const updateHideNot = (documentId, collection) => {
    // Update hideNot in Firestore
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .collection(collection) // Adjust the collection name as needed
      .doc(documentId)
      .update({ hideNot: true })
      .then(() => {
        fetchDocuments();
        console.log("Document successfully updated!");

        // Update local state to hide the item
        setDocuments((prevDocuments) =>
          prevDocuments.map((doc) =>
            doc.id === documentId
              ? { ...doc, data: { ...doc.data, hideNot: true } }
              : doc
          )
        );
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
      });
  };

  useEffect(() => {
    fetchDocuments();
  }, [isFocused]);

  const DocumentItem = ({
    title,
    expiryDate,
    collection,
    documentId,
    hideNot,
    category,
    message,
  }) => (
    <Pressable
      onPress={() =>
        navigation.navigate("NotDisplay", {
          title,
          category,
          message,
          expiryDate: expiryDate?.toDate().toLocaleDateString("en-GB"),
          documentId,
          dueDate: "1234",
        })
      }
      style={{
        width: windowWidth - 10,
        marginBottom: 2,
        backgroundColor: COLORS.grey,
        paddingVertical: 15,
        paddingHorizontal: 10,
        paddingRight: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        // borderRadius: 8,
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <Image
          source={{ uri: tempPic }}
          style={{ height: 30, width: 30, borderRadius: 15, marginRight: 10 }}
        />
        <View>
          <Text style={{ color: "white", fontWeight: "700" }}>{title}</Text>
          {/* <Text>{documentId}</Text> */}

          <Text style={{ fontSize: 12, color: "lightgrey" }}>
            Due Date: {expiryDate.toDate().toLocaleDateString("en-GB")}
          </Text>
        </View>
      </View>
      {/* <Text>{expiryDate}</Text> */}
      <Pressable
        onPress={() => updateHideNot(documentId, collection)}
        style={{ padding: 10, paddingBottom: 5, flexDirection: "row" }}
      >
        <FontAwesome name="envelope-open-o" size={16} color="white" />
        {/* <FontAwesome name="envelope" size={16} color="white" /> */}
      </Pressable>
    </Pressable>
  );

  const renderItem = ({ item }) => (
    <DocumentItem
      title={item.data.title}
      //   imageUrl={item.data.imageUrl}
      expiryDate={item.data.expiryDate}
      collection={item.data.collection}
      documentId={item.data.documentId}
      hideNot={item.data.hideNot}
      category={item.data.category}
      message={item.data.message}
      //   navigation={navigation}
    />
  );

  return (
    <View style={styles.screenStyle}>
      <FlatList
        data={documents}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View
            style={{
              paddingTop: 10,
              alignItems: "flex-start",
              flexDirection: "row",
            }}
          >
            <Pressable
              style={{
                backgroundColor: COLORS.mainGreen,
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
                marginRight: 2,
              }}
            >
              <Text style={{ color: COLORS.black, fontWeight: "700" }}>
                All
              </Text>
            </Pressable>
            <Pressable
              style={{
                backgroundColor: COLORS.grey,
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
                marginRight: 2,
              }}
            >
              <Text style={{ color: "white", fontWeight: "700" }}>Cards</Text>
            </Pressable>
            <Pressable
              style={{
                backgroundColor: COLORS.grey,
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
                marginRight: 2,
              }}
            >
              <Text style={{ color: "white", fontWeight: "700" }}>Team</Text>
            </Pressable>
            <Pressable
              style={{
                backgroundColor: COLORS.grey,
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
                marginRight: 2,
              }}
            >
              <Text style={{ color: "white", fontWeight: "700" }}>Hub</Text>
            </Pressable>
          </View>
        )}
        ListFooterComponent={() => (
          <Pressable
            onPress={() => navigation.navigate("Profile")}
            style={{
              alignSelf: "center",
              paddingVertical: 10,
              paddingHorizontal: 20,
              // backgroundColor: COLORS.mainGreen,
              borderRadius: 4,
            }}
          ></Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.black,
  },
});

export default ExpiringInformation;
