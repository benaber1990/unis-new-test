import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Dimensions,
  FlatList,
} from "react-native";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";

import COLORS from "../misc/COLORS";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";

import { useIsFocused } from "@react-navigation/native";

import firebase from "firebase/compat";

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

export default function ExpensesDisplay({ navigation, route }) {
  const { selectedDate } = route.params;

  const [showCalendar, setShowCalendar] = useState(true);
  const [selected, setSelected] = useState("");
  const [content, setContent] = useState("");

  const { uid } = firebase.auth().currentUser;

  const isFocused = useIsFocused();

  // Get Users
  const fetchContent = () => {
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .collection("receipts")
      .get()
      .then((querySnapshot) => {
        const contactsArray = [];
        querySnapshot.forEach((doc) => {
          contactsArray.push({
            data: doc.data(),
          });
        });
        setContent(contactsArray);
        console.log("contacts", content);
      });
  };

  useEffect(() => {
    fetchContent();
  }, [isFocused]);

  function showCalendarHandler() {
    setShowCalendar((p) => !p);
  }

  // FlatList
  const Item = ({ title, imageUrl, documentId }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ExpenseSingle", { title, imageUrl, documentId })
      }
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 20,
          marginTop: 20,
        }}
      >
        <Text style={{ color: COLORS.mainGreen }}>{title}</Text>
        <Ionicons name="md-eye-outline" size={18} color="white" />
        <Text style={{ color: "white" }}>{title}</Text>
      </View>
      <View
        style={{
          borderWidth: 1,
          borderStyle: "dashed",
          borderColor: COLORS.mainGreen,
          height: 1,
          marginTop: 10,
        }}
      />
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <Item
      title={item.data.title}
      imageUrl={item.data.imageUrl}
      documentId={item.data.documentId}
    />
  );

  // Calendar
  const CalendarModal = ({ onPress }) => (
    <View>
      <Pressable onPress={onPress} style={styles.calendarModalStyle}>
        <Text>Calendar Modal</Text>
        <Calendar
          onDayPress={(day) => {
            setSelected(day.dateString);
            console.log("selected day", selected);
          }}
          markedDates={{
            [selected]: {
              selected: true,
              disableTouchEvent: true,
              selectedDotColor: COLORS.mainGreen,
            },
          }}
          theme={{
            selectedDayBackgroundColor: COLORS.mainGreen,
            todayTextColor: COLORS.mainGreen,
            arrowColor: COLORS.mainGreen,
          }}
        />
      </Pressable>
      {/* Buttons */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
          marginHorizontal: 20,
        }}
      >
        <TouchableOpacity
          style={{
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 4,
            backgroundColor: COLORS.mainGreen,
            width: 120,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontWeight: "700",
            }}
          >
            View Month
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 4,
            backgroundColor: COLORS.mainGreen,
            width: 120,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontWeight: "700",
            }}
          >
            View Date
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: COLORS.black }}
    >
      {showCalendar && (
        <View style={styles.screenStyle}>
          {/* Header */}
          <View style={{ marginLeft: 20, marginTop: 20 }}>
            <Text style={{ fontSize: 22, fontWeight: "700", color: "white" }}>
              Scanned Receipts
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "300",
                color: COLORS.mainGreen,
                marginTop: 4,
              }}
            >
              View all of your scanned receipts here
            </Text>
          </View>

          {/* Calendar */}
          <TouchableOpacity
            onPress={() => navigation.navigate("ExpensesCalendar")}
            style={{
              alignSelf: "flex-end",
              paddingVertical: 10,
              paddingHorizontal: 10,
              backgroundColor: COLORS.grey,
              borderRadius: 12,
              marginRight: 40,
              marginTop: 20,
            }}
          >
            <FontAwesome name="calendar" size={48} color={COLORS.mainGreen} />
          </TouchableOpacity>

          {/* List */}

          <View style={styles.cardStyle}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 10,
                marginBottom: 15,
              }}
            >
              <Text
                style={{
                  color: COLORS.mainGreen,
                  fontWeight: "700",
                  fontSize: 16,
                }}
              >
                Receipt
              </Text>
              <Text
                style={{
                  color: COLORS.mainGreen,
                  fontWeight: "700",
                  fontSize: 16,
                }}
              >
                Date Uploaded
              </Text>
            </View>
            {content && (
              <View>
                <FlatList data={content} renderItem={renderItem} />
              </View>
            )}
          </View>
          {/* 
          <View
            style={{
              width: 50,
              paddingVertical: 2,
              paddingHorizontal: 5,
              borderRadius: 16,
              backgroundColor: COLORS.mainGreen,
              alignSelf: "center",
              alignItems: "center",
              marginTop: 30,
              borderWidth: 1,
              marginBottom: 30,
            }}
          >
            <Text>1</Text>
          </View> */}
        </View>
      )}

      {/* Calendar Modal */}
      {!showCalendar && (
        <Pressable
          onPress={showCalendarHandler}
          style={[
            styles.screenStyle,
            {
              paddingTop: 60,
            },
          ]}
        >
          <CalendarModal />
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    backgroundColor: COLORS.black,
    alignItems: "center",
  },
  cardStyle: {
    marginTop: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: COLORS.grey,
    marginHorizontal: 30,
    borderWidth: 1,
    width: windowWidth - 20,
  },
  calendarModalStyle: {
    borderRadius: 12,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 10,
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 30,
    borderWidth: 3,
  },
});
