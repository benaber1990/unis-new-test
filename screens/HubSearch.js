import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import COLORS from "../misc/COLORS";
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

export default function HubSearch({ navigation }) {
  const [content, setContent] = useState([]);

  // Fetch User Data
  const isFocused = useIsFocused();

  // Fetch Users
  const fetchUsers = () => {
    firebase
      .firestore()
      .collection("hubpostscontent")
      .get()
      .then((querySnapshot) => {
        const contactsArray = [];
        querySnapshot.forEach((doc) => {
          contactsArray.push({
            data: doc.data(),
          });
        });
        setContent(contactsArray);
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

  const filteredContent = content.filter((user) => {
    const postTitle = user?.data.title?.toLowerCase();
    return postTitle?.includes(searchQuery.toLowerCase());
  });

  // FlatList
  const Item = ({
    content,
    title,
    picLink,
    posterProfPic,
    posterName,
    postId,
  }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("HubPostDisplay", {
          content,
          title,
          picLink,
          posterProfPic,
          posterName,
          postId,
        })
      }
      style={styles.itemStyle}
    >
      <Image
        source={{ uri: picLink }}
        style={{ height: 100, width: 100, marginRight: 20, borderRadius: 4 }}
      />
      <Text style={{ fontSize: 16, fontWeight: "700", color: "white" }}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <Item
      title={item.data.title}
      content={item.data.content}
      picLink={item.data.picLink}
      posterProfPic={item.data.posterProfPic}
      posterName={item.data.posterName}
      postId={item.data.postId}
    />
  );

  return (
    <View style={styles.screenStyle}>
      <Text>Hub Searchhhh</Text>

      {/* Search Bar TextInput */}
      <View style={{ marginBottom: 5 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "300",
            color: "darkgrey",
          }}
        >
          Search the{" "}
          <Text
            style={{
              fontWeight: "700",
              color: COLORS.mainGreen,
            }}
          >
            UNIS Hub
          </Text>
        </Text>
      </View>
      <TextInput
        style={styles.textInputStyle}
        placeholder="Search for posts & content"
        placeholderTextColor={"lightgrey"}
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {content && (
        <FlatList
          data={filteredContent}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => <View style={{ height: 20 }} />}
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
  },
  itemStyle: {
    // backgroundColor: COLORS.grey,
    width: 300,
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    marginBottom: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "white",
  },
  textInputStyle: {
    height: 60,
    width: 300,
    borderWidth: 1,
    borderColor: "darkgrey",
    borderRadius: 40,
    // backgroundColor: COLORS.grey,
    paddingLeft: 25,
    fontSize: 18,
    color: "white",
    marginTop: 5,
  },
});
