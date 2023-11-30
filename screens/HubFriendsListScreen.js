import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Pressable,
} from "react-native";
import COLORS from "../misc/COLORS";
import demoFriendsData from "../misc/DEMO_FRIENDS";
import { Feather } from "@expo/vector-icons";
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

export default function HubFriendListScreen({ navigation }) {
  const [users, setUsers] = useState();
  const [friends, setFriends] = useState([]);
  const { uid } = firebase.auth().currentUser;

  const fetchFriends = async () => {
    try {
      const userId = uid; // Replace with the actual user ID

      // Get the user document
      const userDoc = await firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .get();
      const userData = userDoc.data();

      // Get the friends IDs
      const friendIds = userData.friends || [];

      // Fetch the friends' details
      const friendsData = await Promise.all(
        friendIds.map(async (friendId) => {
          const friendDoc = await firebase
            .firestore()
            .collection("users")
            .doc(friendId)
            .get();
          return {
            userId: friendId,
            data: friendDoc.data(),
          };
        })
      );

      setFriends(friendsData);
      console.log("FRIENDS DATA", friendsData);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  // const isFocused = useIsFocused();

  // // Get Friends List
  // const fetchFriends = () => {
  //   firebase
  //     .firestore()
  //     .collection("users")
  //     .get()
  //     .then((querySnapshot) => {
  //       const friendsArray = [];
  //       querySnapshot.forEach((doc) => {
  //         const userData = doc.data();
  //         const friends = userData.friends || []; // Make sure Friends is an array or provide a default empty array

  //         friendsArray.push({
  //           userId: doc.id,
  //           friends,
  //         });
  //       });
  //       setFriends(friendsArray);
  //       console.log("FRIENDS ARRAY", friendsArray);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching users:", error);
  //     });
  // };

  // useEffect(() => {
  //   fetchFriends();
  // }, [isFocused]);

  // // Get Users
  // const fetchUsers = () => {
  //   firebase
  //     .firestore()
  //     .collection("users")
  //     .get()
  //     .then((querySnapshot) => {
  //       const contactsArray = [];
  //       querySnapshot.forEach((doc) => {
  //         contactsArray.push({
  //           data: doc.data(),
  //         });
  //       });

  //       setUsers(contactsArray);
  //       // console.log(users);
  //     });
  // };

  // useEffect(() => {
  //   fetchUsers();
  // }, [isFocused]);

  // FlatList
  const Item = ({ firstName, surname, userId, profPic }) => (
    <View style={{}}>
      <Pressable
        onPress={() =>
          navigation.navigate("HubFriendProfile", {
            firstName,
            surname,
            profPic,
            userId,
          })
        }
        style={styles.itemStyle}
      >
        <Image
          source={{
            uri: profPic,
          }}
          style={{
            height: 50,
            width: 50,
            borderRadius: 25,
            marginRight: 15,
            borderWidth: 2,
            borderColor: COLORS.mainGreen,
          }}
        />
        <View style={{ width: 170 }}>
          <Text style={{ color: "white", fontWeight: "700" }}>
            {firstName} {surname}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: "lightgrey",
              marginTop: 1,
              marginBottom: 1,
            }}
          >
            occupation
          </Text>
          {/* <Text style={{ fontSize: 12, color: "grey" }}>company</Text> */}
        </View>

        <Feather
          name="send"
          size={18}
          color="lightgrey"
          style={{ marginLeft: 10 }}
        />
      </Pressable>
      <View
        style={{
          width: 280,
          height: 0.5,
          backgroundColor: "grey",
          alignSelf: "center",
        }}
      />
    </View>
  );

  const renderItem = ({ item }) => (
    <Item
      firstName={item.data.firstName}
      surname={item.data.surname}
      profPic={item.data.profPic}
      userId={item.data.userId}
    />
  );

  return (
    <View style={styles.screenStyle}>
      {friends && (
        <FlatList
          data={friends}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
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
    // marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
  },
});
