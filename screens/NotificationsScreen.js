import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import COLORS from "../misc/COLORS";
import NOTIFICATIONS_DATA from "../misc/NOTIFICATIONS_DATA";
import {
  Ionicons,
  MaterialCommunityIcons,
  Entypo,
  AntDesign,
} from "@expo/vector-icons";

import firebase from "firebase/compat";

// import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/auth";
import { useIsFocused } from "@react-navigation/native";

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

function NotificationsScreen({ navigation }) {
  const [data, setData] = useState("");
  const { uid } = firebase.auth().currentUser;
  const [contacts, setContacts] = useState([]);
  const [date, setDate] = useState();

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

  // Fetch Data
  const fetchDocPics = () => {
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .collection("notifications")
      .get()
      .then((querySnapshot) => {
        const contactsArray = [];
        querySnapshot.forEach((doc) => {
          contactsArray.push({
            data: doc.data(),
            id: doc.id,
          });
        });
        setContacts(contactsArray);
        // console.log("CONTACTS", contacts);
      });
  };

  useEffect(() => {
    fetchDocPics();
  }, [isFocused]);

  // Delete Card
  const deleteNotification = (documentId) => {
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .collection("notifications")
      .doc(documentId)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
        fetchDocPics();
        // createAlert();
        // Refresh the documents after deletion
        // fetchDocPics();
      })
      .catch((error) => {
        console.error("Error deleting document: ", error);
      });
  };

  const Item = ({ title, category, message, dueDate, documentId }) => (
    <View style={styles.itemStyle}>
      <View
        style={{
          width: 20,
          backgroundColor: COLORS.mainGreen,
          borderTopLeftRadius: 4,
          borderBottomLeftRadius: 4,
        }}
      />
      <View
        style={{
          flexDirection: "row",
          paddingVertical: 10,
        }}
      >
        <Pressable
          onPress={() =>
            navigation.navigate("NotDisplay", {
              title,
              category,
              message,
              dueDate: dueDate?.toDate().toLocaleDateString("en-GB"),
              documentId,
            })
          }
          style={{ marginLeft: 20, width: 230 }}
        >
          <Text style={{ fontSize: 16, fontWeight: "500", color: "white" }}>
            {title}
          </Text>
          <Text style={{ fontweight: "300", marginTop: 3, color: "lightgrey" }}>
            {message}
          </Text>
          <Text style={{ fontweight: "300", marginTop: 3, color: "lightgrey" }}>
            {dueDate?.toDate().toLocaleDateString("en-GB")}
          </Text>
        </Pressable>
        {/* <Pressable
          onPress={() =>
            navigation.navigate("NotDisplay", { alertTitle, alertCat })
          }
          style={{ marginLeft: 15 }}
        >
          <Ionicons name="chevron-forward-circle" size={24} color="black" />
        </Pressable> */}
      </View>

      <Pressable
        onPress={() => deleteNotification(documentId)}
        style={{
          backgroundColor: COLORS.black,
          // height: "100%",
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: 15,
        }}
      >
        <AntDesign name="closecircleo" size={24} color="tomato" />
      </Pressable>
    </View>
  );

  const renderItem = ({ item }) => (
    <Item
      title={item.data.title}
      category={item.data.category}
      message={item.data.message}
      dueDate={item.data.dueDate}
      documentId={item.data.documentId}
    />
  );

  return (
    <View style={styles.screenStyle}>
      {contacts && (
        <FlatList
          data={contacts}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => <View style={{ marginTop: 20 }}></View>}
          ListFooterComponent={() => (
            <View>
              {/* <Pressable
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                  borderRadius: 3,
                  alignSelf: "center",
                  backgroundColor: COLORS.mainGreen,
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 20,
                  marginBottom: 30,
                }}
              >
                <MaterialCommunityIcons
                  name="eraser-variant"
                  size={24}
                  color="black"
                  style={{ marginRight: 5 }}
                />
                <Text style={{ fontWeight: "700" }}>
                  Clear All Notifications
                </Text>
              </Pressable> */}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    backgroundColor: COLORS.black,
    flex: 1,
    // alignItems: "center",
  },
  itemStyle: {
    backgroundColor: COLORS.grey,
    marginBottom: 20,
    // paddingVertical: 15,
    // paddingHorizontal: 20,
    borderRadius: 4,
    flexDirection: "row",
    width: 250,
    marginLeft: 20,
    // alignSelf: "center",
  },
});

export default NotificationsScreen;
