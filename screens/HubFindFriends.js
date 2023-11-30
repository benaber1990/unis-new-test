import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import COLORS from "../misc/COLORS";
import demoFriendsData from "../misc/DEMO_FRIENDS";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

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

export default function FindFriendsScreen({ navigation }) {
  const [contacts, setContacts] = useState([]);

  // Fetch User Data
  const isFocused = useIsFocused();

  // Fetch Users
  const fetchUsers = () => {
    firebase
      .firestore()
      .collection("users")
      .get()
      .then((querySnapshot) => {
        const contactsArray = [];
        querySnapshot.forEach((doc) => {
          contactsArray.push({
            data: doc.data(),
          });
        });
        setContacts(contactsArray);
        console.log("success!", contactsArray);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, [isFocused]);

  // Search Logic
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredUsers = contacts.filter((user) => {
    const userName = user?.data.firstName?.toLowerCase();
    const userLocation = user?.data.location?.toLowerCase();
    const userCompany = user?.data.company?.toLowerCase();
    const userJobTitle = user?.data.jobTitle?.toLowerCase();

    const searchLowerCase = searchQuery.toLowerCase();

    return (
      userName?.includes(searchLowerCase) ||
      userLocation?.includes(searchLowerCase) ||
      userCompany?.includes(searchLowerCase) ||
      userJobTitle?.includes(searchLowerCase)
    );
  });

  // FlatList Component
  const Item = ({ firstName, userId, profPic, surname, friends }) => {
    const { uid } = firebase.auth().currentUser;

    const isFriend = friends && friends?.includes(uid);

    const backgroundColor = isFriend ? COLORS.mainGreen : COLORS.grey;

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("HubFriendAdd", {
            firstName,
            userId,
            profPic,
            surname,
            isFriend,
          })
        }
        style={[styles.itemStyle, { backgroundColor: backgroundColor }]}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={{
              uri: "https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            }}
            style={styles.imageStyle}
          />
          <View>
            <Text style={{ color: "lightgrey", fontWeight: "600" }}>
              {firstName}
            </Text>
            <Text style={{ color: "darkgrey", fontSize: 12 }}>occupation</Text>
          </View>
        </View>
        {!isFriend && (
          <View style={{}}>
            <Ionicons name="person-add" size={20} color="lightgrey" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }) => (
    <Item
      firstName={item.data.firstName}
      userId={item.data.userId}
      profPic={item.data.profPic || ""}
      surname={item.data.surname}
      friends={item.data.friends}
    />
  );

  return (
    <View style={styles.screenStyle}>
      <Text>Find Friends Screen</Text>
      {/* Search Bar */}
      <View
        style={{
          backgroundColor: COLORS.mainGreen,
          width: "100%",
          alignItems: "center",
          paddingVertical: 30,
          borderBottomRightRadius: 60,
          borderBottomLeftRadius: 60,
        }}
      >
        <TextInput
          placeholder="Search for people you know"
          placeholderTextColor={"lightgrey"}
          style={styles.textInputStyle}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* List */}
      {contacts && (
        <FlatList
          data={filteredUsers.length > 0 ? filteredUsers : contacts}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => <View style={{ marginTop: 30 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    backgroundColor: COLORS.black,
    alignItems: "center",
    marginTop: -20,
  },
  textInputStyle: {
    height: 60,
    width: 300,
    backgroundColor: COLORS.grey,
    borderRadius: 30,
    fontSize: 18,
    color: "white",
    paddingHorizontal: 20,
  },
  itemStyle: {
    width: 350,
    backgroundColor: COLORS.grey,
    marginBottom: 3,
    paddingVertical: 8,
    // borderRadius: 40,
    paddingHorizontal: 20,
    paddingRight: 40,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imageStyle: {
    height: 50,
    width: 50,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: COLORS.lightGreen,
    marginRight: 12,
  },
});
