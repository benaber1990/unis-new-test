import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import COLORS from "../misc/COLORS";
import {
  Ionicons,
  MaterialCommunityIcons,
  Entypo,
  Feather,
  MaterialIcons,
} from "@expo/vector-icons";
import HomeItemBox from "../miscComps/HomeItemBox";
import ProfNewIcon from "../miscComps/ProfNewIcon";
import TextCardComp from "../miscComps/TextCardComp";
import LATEST_NEWS_DATA from "../misc/LATEST_NEWS_DATA";
import NOTIFICATIONS_DATA from "../misc/NOTIFICATIONS_DATA";

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

const windowWidth = Dimensions.get("window").width;

const tempPic =
  "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

function Hub({ navigation }) {
  const [data, setData] = useState("");
  const { uid } = firebase.auth().currentUser;
  const [contacts, setContacts] = useState([]);
  const [yesNots, setYesNots] = useState(false);
  const [users, setUsers] = useState("");

  const [isLiked, setIsLiked] = useState(true);
  const [isShared, setIsShared] = useState(false);
  const [isMarked, setIsMarked] = useState(false);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    // Cleanup the timeout to avoid memory leaks
    return () => clearTimeout(timeoutId);
  }, []);

  // Search Bar
  const [searchQuery, setSearchQuery] = useState("");

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

  const fetchData = async () => {
    try {
      const { uid } = firebase.auth().currentUser;
      if (!uid) return;
      const collectionRef = firebase.firestore().collection("users").doc(uid);
      const snapshot = await collectionRef.get();
      // console.log("snapshotdata", snapshot?.data());
      // const fetchedData = snapshot.docs.map((doc) => ({
      //   id: doc.id,
      //   ...doc.data(),
      // }));
      // console.log("fetchedData", snapshot?.data());

      setData(snapshot?.data());
      // console.log(data.bio);
      // console.log("Hello");
      // console.log(data);
      // console.log(data[0].firstName);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isFocused]);

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
        setUsers(contactsArray);
        console.log("success!", contactsArray);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, [isFocused]);

  // Fetch Post Content
  const fetchDocPics = () => {
    firebase
      .firestore()
      .collection("hubpostscontent")
      .orderBy("timestamp", "desc")
      .get()
      .then((querySnapshot) => {
        const contactsArray = [];
        querySnapshot.forEach((doc) => {
          contactsArray.push({
            data: doc.data(),
          });
        });
        const sortedComments = contactsArray.sort(
          (a, b) => b.data.timestamp - a.data.timestamp
        );
        setContacts(sortedComments);
        // console.log("success!", contacts);
      });
  };

  useEffect(() => {
    fetchDocPics();
  }, [isFocused]);

  useEffect(() => {
    notificationCount > 0 ? setYesNots(true) : setYesNots(false);
  }, [isFocused]);

  // NOTIFICATIONS
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const uid = firebase.auth().currentUser?.uid;

    if (!uid) {
      return;
    }

    const fetchDocuments = async () => {
      try {
        const [certsSnapshot, cardsSnapshot, notificationsSnapshot] =
          await Promise.all([
            firebase
              .firestore()
              .collection("users")
              .doc(uid)
              .collection("certs")
              .where("hideNot", "==", true)
              .get(),
            firebase
              .firestore()
              .collection("users")
              .doc(uid)
              .collection("cards")
              .where("hideNot", "==", true)
              .get(),
            firebase
              .firestore()
              .collection("users")
              .doc(uid)
              .collection("notifications")
              .where("hideNot", "==", true)
              .get(),
          ]);

        const certsCount = certsSnapshot.size;
        const cardsCount = cardsSnapshot.size;
        const notificationsCount = notificationsSnapshot.size;

        const totalCount = certsCount + cardsCount + notificationsCount;

        setNotificationCount(totalCount);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchDocuments();
  }, []);

  const [text, onChangeText] = React.useState("Useless Text");

  const [hasNots, setHasNots] = useState(false);

  // Has Notifications Logic
  const NUMNOTS = NOTIFICATIONS_DATA.length;

  useEffect(() => {
    NUMNOTS > 0 ? setHasNots(true) : setHasNots(false);
  }),
    [];

  // Filter the user list based on the search query
  const filteredUsers = contacts.filter((user) => {
    const userName = user.data.title.toLowerCase();
    return userName.includes(searchQuery.toLowerCase());
  });

  // Chat Icon
  const ChatIcon = () => (
    <TouchableOpacity
      onPress={() => navigation.navigate("HubAddPost")}
      style={styles.iconContainer}
    >
      <MaterialIcons name="post-add" size={24} color="black" />
    </TouchableOpacity>
  );

  // Social Media Card Comp Item
  const Item = ({
    content,
    title,
    picLink,
    posterProfPic,
    posterName,
    postId,
  }) => {
    return (
      <Pressable
        onPress={() =>
          navigation.navigate("HubPostDisplay", {
            title,
            picLink,
            postId,
          })
        }
        style={[
          styles.itemStyle,
          {
            borderRadius: 0,
            paddingVertical: 15,
            backgroundColor: COLORS.black,
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            alignSelf: "flex-start",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Image
            source={{ uri: posterProfPic }}
            style={{
              height: 30,
              width: 30,
              borderRadius: 25,
              borderWidth: 1,
              borderColor: COLORS.mainGreen,
            }}
          />
          <View style={{ marginLeft: 10 }}>
            <Text
              style={{
                color: "white",
                fontWeight: "700",
                color: COLORS.mainGreen,
                fontSize: 12,
              }}
            >
              {posterName}{" "}
              <Text style={{ color: "white", fontWeight: "300" }}>
                posted...
              </Text>
            </Text>
          </View>
        </View>
        <View>
          <ImageBackground
            source={{ uri: picLink }}
            style={{
              height: 220,
              width: windowWidth,
              justifyContent: "flex-end",
              paddingBottom: 30,
            }}
            imageStyle={
              {
                // borderRadius: 12,
                // borderWidth: 2,
                // borderColor: COLORS.mainGreen,
              }
            }
          ></ImageBackground>
        </View>
        {/* Icons */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "center",
            width: 300,
            // alignItems: "center",
            // alignSelf: "flex-end",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <Text style={{ color: "white" }}>{title}</Text>
          {/* Item Icons */}
          <View style={{ flexDirection: "row" }}>
            <View>
              <MaterialCommunityIcons
                name="comment-plus-outline"
                size={24}
                color="white"
                style={{ marginRight: 11 }}
              />
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  const renderItem = ({ item }) => (
    <Item
      title={item.data.title}
      picLink={item.data.picLink}
      content={item.data.content}
      posterProfPic={item.data.posterProfPic}
      posterName={item.data.posterName}
      postId={item.data.postId}
    />
  );

  // Stories FlatList
  const Item2 = ({ firstName }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("HubFriendProfile", {
          firstName,
        })
      }
      style={{ marginRight: 30, alignItems: "center" }}
    >
      <Image
        source={{ uri: tempPic }}
        style={{
          height: 70,
          width: 70,
          borderRadius: 35,
          borderWidth: 2,
          borderColor: COLORS.mainGreen,
        }}
      />
      <Text
        style={{
          color: "lightgrey",
          fontSize: 12,
          fontWeight: "600",
          marginTop: 3,
        }}
      >
        {firstName}
      </Text>
    </TouchableOpacity>
  );

  const renderItem2 = ({ item }) => <Item2 firstName={item.data.firstName} />;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.black }}>
      {data && (
        <View style={styles.screenStyle}>
          {/* FlatList 1 */}
          {contacts && (
            <FlatList
              data={contacts}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={() => (
                <View>
                  {/* Stories Section */}

                  {/* Header Section */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 10,
                      marginTop: 20,
                      marginHorizontal: 40,
                    }}
                  >
                    {/* Column A */}
                    <TouchableOpacity
                      onPress={() => navigation.navigate("HubSearch")}
                      style={{ width: 100 }}
                    >
                      <Ionicons
                        name="ios-search-sharp"
                        size={24}
                        color={COLORS.mainGreen}
                      />
                    </TouchableOpacity>

                    {/* Column B */}
                    <View
                      style={{
                        alignItems: "center",
                        alignSelf: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 20,
                          fontWeight: "600",
                        }}
                      >
                        Welcome
                      </Text>
                      <View style={{ flexDirection: "row" }}>
                        <Text
                          style={{
                            color: "white",
                            fontSize: 16,
                            fontWeight: "200",
                          }}
                        >
                          to the{" "}
                        </Text>
                        <Text
                          style={{
                            color: COLORS.mainGreen,
                            fontSize: 16,
                            fontWeight: "700",
                          }}
                        >
                          UNIS Hub
                        </Text>
                      </View>
                    </View>

                    {/* Column C */}
                    <View
                      style={{ width: 100, marginRight: -20, marginLeft: 20 }}
                    >
                      <View
                        onPress={() => navigation.navigate("HubMyProfile")}
                        style={{
                          borderRadius: 20,
                          backgroundColor: COLORS.mainGreen,
                          flexDirection: "row",
                          alignItems: "center",
                          paddingHorizontal: 4,
                          paddingVertical: 4,
                          justifyContent: "center",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => navigation.navigate("Profile")}
                        >
                          <Image
                            source={{ uri: data?.profPic }}
                            style={{
                              height: 30,
                              width: 30,
                              borderRadius: 20,
                              borderWidth: 2,
                              borderColor: COLORS.black,
                              marginRight: 10,
                            }}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("ExpiringInformation")
                          }
                        >
                          <Ionicons
                            name="notifications"
                            size={24}
                            color={COLORS.black}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  {/* Tiles Row */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginHorizontal: 10,
                      marginTop: 10,
                      marginBottom: 5,
                      maxWidth: windowWidth - 20,
                      // backgroundColor: COLORS.mainGreen,
                    }}
                  >
                    <ProfNewIcon
                      title="Messages"
                      iconName="ios-chatbubbles-outline"
                      onPress={() => navigation.navigate("HubMessages")}
                    />
                    <ProfNewIcon
                      title="Friends"
                      iconName="people"
                      onPress={() => navigation.navigate("HubFriendsList")}
                    />

                    <ProfNewIcon
                      title="Add Post"
                      iconName="globe-outline"
                      onPress={() => navigation.navigate("HubAddPost")}
                      size={26}
                    />
                    <ProfNewIcon
                      title="Add People"
                      iconName="md-add-circle-outline"
                      onPress={() => navigation.navigate("FindFriends")}
                      size={24}
                    />
                    <ProfNewIcon
                      title="Requests"
                      iconName="ios-person-add-outline"
                      onPress={() => navigation.navigate("HubFriendRequests")}
                    />
                  </View>
                </View>
              )}
            />
          )}
        </View>
      )}

      {/* User Not Logged In */}
      {!data && (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: COLORS.black,
            // paddingTop: 120,
          }}
        >
          <Image
            source={{ uri: "https://i.imgur.com/rDCre6r.png" }}
            style={{ height: 75, width: 75, resizeMode: "contain" }}
          />
          {isVisible && (
            <View style={{ alignItems: "center" }}>
              <Pressable
                onPress={() => navigation.navigate("CreateProfileA")}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 6,
                  backgroundColor: COLORS.mainGreen,
                  marginVertical: 20,
                }}
              >
                <Text style={{ fontWeight: "700" }}>Complete Account</Text>
              </Pressable>
              <Text style={{ color: "white", textAlign: "center" }}>
                Please complete your account for the full UNIS experience
              </Text>
            </View>
          )}
        </View>
      )}
      {data && <ChatIcon />}
    </View>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    backgroundColor: COLORS.black,
    paddingTop: 60,
  },
  textInputStyle: {
    backgroundColor: COLORS.grey,
    height: 60,
    width: 275,
    paddingLeft: 25,
    fontSize: 16,
    borderTopLeftRadius: 40,
    borderBottomLeftRadius: 40,
    color: "white",
  },
  itemStyle: {
    backgroundColor: COLORS.grey,
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 0,
    // padding: 20,
    borderRadius: 12,
    // paddingHorizontal: 40,
    // marginHorizontal: 20,
    width: 350,
  },
  iconContainer: {
    position: "absolute",
    bottom: 14,
    right: 12,
    height: 40,
    width: 40,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.mainGreen,
  },
});

export default Hub;
