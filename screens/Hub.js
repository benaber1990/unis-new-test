import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TextInput,
  FlatList,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import COLORS from "../misc/COLORS";
import { Ionicons } from "@expo/vector-icons";
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

function Hub({ navigation }) {
  const [data, setData] = useState("");
  const { uid } = firebase.auth().currentUser;
  const [contacts, setContacts] = useState([]);
  const [yesNots, setYesNots] = useState(false);

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

  // Fetch Profile Image
  const fetchProfPic = () => {
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .collection("profpics")
      .get()
      .then((querySnapshot) => {
        const contactsArray = [];
        querySnapshot.forEach((doc) => {
          contactsArray.push({
            data: doc.data(),
          });
        });
        setContacts(contactsArray);
        // console.log(contacts);
      });
  };

  useEffect(() => {
    fetchProfPic();
  }, [isFocused]);

  // Fetch Post Content
  const fetchDocPics = () => {
    firebase
      .firestore()
      .collection("adminposts")
      .get()
      .then((querySnapshot) => {
        const contactsArray = [];
        querySnapshot.forEach((doc) => {
          contactsArray.push({
            data: doc.data(),
          });
        });
        setContacts(contactsArray);
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

  const [isLiked, setIsLiked] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [isMarked, setIsMarked] = useState(false);

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

  // Social Media Card Comp Item
  const Item = ({ content, title, picLink }) => (
    <Pressable
      onPress={() =>
        navigation.navigate("ContentDisplay", {
          content,
          title,
          picLink,
        })
      }
      style={styles.itemStyle}
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
          source={{ uri: "https://i.imgur.com/N0RjJE2.png" }}
          style={{
            height: 50,
            width: 50,
            borderRadius: 25,
            borderWidth: 1,
            borderColor: COLORS.mainGreen,
          }}
        />
        <View style={{ marginLeft: 20 }}>
          <Text
            style={{
              color: "white",
              fontWeight: "700",
              color: COLORS.mainGreen,
            }}
          >
            UNIS <Text style={{ color: "white" }}>posted...</Text>
          </Text>
        </View>
      </View>
      <ImageBackground
        source={{ uri: picLink }}
        style={{
          height: 170,
          width: 200,
          justifyContent: "flex-end",
          paddingBottom: 30,
        }}
        imageStyle={{
          borderRadius: 12,
          borderWidth: 2,
          borderColor: COLORS.mainGreen,
        }}
      ></ImageBackground>

      <View>
        <Text
          style={{
            textAlign: "center",
            fontSize: 16,
            fontWeight: "600",
            marginTop: 20,
            color: "white",
          }}
        >
          {title}
        </Text>
      </View>
    </Pressable>
  );

  const renderItem = ({ item }) => (
    <Item
      title={item.data.title}
      picLink={item.data.picLink}
      content={item.data.content}
    />
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      {data && (
        <View style={styles.screenStyle}>
          {/* Header Section */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            {/* Column A */}
            <View>
              <View>
                <Pressable onPress={() => navigation.navigate("Profile")}>
                  <Image
                    source={{ uri: data?.profPic }}
                    style={{
                      height: 70,
                      width: 70,
                      borderRadius: 35,
                      borderWidth: 2,
                      borderColor: COLORS.mainGreen,
                    }}
                  />
                </Pressable>
              </View>
            </View>

            {/* Column B */}
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  color: "white",
                  fontSize: 22,
                  fontWeight: "600",
                }}
              >
                Welcome
              </Text>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "200" }}
                >
                  to the{" "}
                </Text>
                <Text
                  style={{
                    color: COLORS.mainGreen,
                    fontSize: 16,
                    fontWeight: "500",
                  }}
                >
                  Hub
                </Text>
              </View>
            </View>

            {/* Column C */}
            <View>
              {!yesNots ? (
                <Pressable
                  onPress={() => navigation.navigate("ExpiringInformation")}
                >
                  <Ionicons
                    name="notifications"
                    size={30}
                    color={COLORS.mainGreen}
                    style={{ marginRight: 10 }}
                  />
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => navigation.navigate("ExpiringInformation")}
                  style={{ alignItems: "center" }}
                >
                  <View
                    style={{
                      height: 6,
                      width: 6,
                      borderRadius: 3,
                      backgroundColor: "red",
                      marginRight: 10,
                      marginBottom: 1,
                    }}
                  />
                  <Ionicons
                    name="notifications"
                    size={30}
                    color={COLORS.mainGreen}
                    style={{ marginRight: 10 }}
                  />
                </Pressable>
              )}
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
            }}
          >
            <ProfNewIcon
              title="Jobs"
              iconName="briefcase-outline"
              onPress={() => navigation.navigate("ComingSoonJobs")}
            />
            <ProfNewIcon
              title="Friends"
              iconName="people"
              onPress={() => navigation.navigate("ComingSoonFriends")}
            />
            <Pressable
              onPress={() => navigation.navigate("AdminPostScreen")}
              style={{
                paddingHorizontal: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="globe-outline"
                size={32}
                color={COLORS.mainGreen}
              />
              <Text style={{ fontWeight: "700", color: "white" }}>Post</Text>
            </Pressable>
            <ProfNewIcon
              title="Training"
              iconName="checkmark-done"
              onPress={() => navigation.navigate("ComingSoonTraining")}
            />
            <ProfNewIcon
              title="Extra"
              iconName="ellipsis-horizontal-circle"
              onPress={() => navigation.navigate("ComingSoonExtra")}
            />
          </View>

          {/* Search Bar */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignSelf: "center",
                  marginTop: 20,
                }}
              >
                <TextInput
                  style={styles.textInputStyle}
                  placeholder="Search the UNIS Hub"
                  placeholderTextColor={"lightgrey"}
                  value={searchQuery}
                  onChangeText={(t) => setSearchQuery(t)}
                />
                <View
                  style={{
                    paddingRight: 10,
                    borderTopRightRadius: 24,
                    borderBottomRightRadius: 24,
                    backgroundColor: COLORS.grey,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="globe-outline"
                    size={32}
                    color={COLORS.mainGreen}
                  />
                </View>
              </View>
            </View>

            {/* Text Comp Card */}
            <TextCardComp
              backCol={COLORS.lightGreen}
              title={"Build Your UNIS Profile"}
              body={
                "Your UNIS profiles gives site managers instant access to your info - so you can always provide your eligibility to work"
              }
              link={() => navigation.navigate("UpdateProfile")}
              buttonText={"Update Now"}
            />

            {/* Social Media Posts FlatList  */}
            <View>
              {/* FlatList 1 */}
              {contacts && (
                <FlatList
                  data={filteredUsers.length > 0 ? filteredUsers : contacts}
                  renderItem={renderItem}
                  showsVerticalScrollIndicator={false}
                  ListHeaderComponent={() => <View style={{ marginTop: 20 }} />}
                />
              )}
            </View>
          </ScrollView>
        </View>
      )}
      {!data && (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: COLORS.black,
            paddingTop: 120,
          }}
        >
          <Image
            source={require("../assets/unislogo.gif")}
            style={{ height: 75, width: 75, resizeMode: "contain" }}
          />
          {isVisible && (
            <View>
              <Pressable
                onPress={() => navigation.navigate("CreateProfile")}
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    backgroundColor: COLORS.black,
    flex: 1,
    paddingTop: 60,
  },
  textInputStyle: {
    backgroundColor: COLORS.grey,
    height: 70,
    width: 275,
    paddingLeft: 20,
    fontSize: 16,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    color: "white",
  },
  itemStyle: {
    backgroundColor: COLORS.grey,
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    paddingHorizontal: 40,
    marginHorizontal: 20,
    width: 300,
  },
});

export default Hub;
