import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import COLORS from "../misc/COLORS";
import {
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import EX_PROFILE_DATA from "../misc/EX_PROFILE_DATA";
import firebase from "firebase/compat";
import NOTIFICATIONS_DATA from "../misc/NOTIFICATIONS_DATA";

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

function Profile({ navigation }) {
  const [data, setData] = useState("");
  const { uid } = firebase.auth().currentUser;
  // const [certificates, setCertificates] = useState([]);
  const [jobTitle, setJobTitle] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [surname, setSurname] = useState(null);
  const [hasNots, setHasNots] = useState(false);
  const [bio, setBio] = useState("");
  const [bioData, setBioData] = useState("");
  const [contacts, setContacts] = useState("");
  const [hasBio, setHasBio] = useState("");
  const [yesNots, setYesNots] = useState(false);
  const [content, setContent] = useState();

  const [user, setUser] = useState(null);

  // Render Content Delay
  const [isVisible, setIsVisible] = useState(false);

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
      setData(snapshot?.data());
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isFocused]);

  // Fetch Images
  const fetchCertificateImages = (uid, colname) => {
    let imgData = [];
    firebase
      .firestore()
      .collection("Images")
      .doc(uid)
      .collection(colname)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((documentSnapshot) => {
          imgData.push(documentSnapshot.data());
        });
      })
      .catch((err) => {
        console.log("err", err);
      });
    return imgData;
  };

  useEffect(() => {
    fetchData();
    // setCertificates(fetchCertificateImages(uid, "certificates"));
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
        console.log(contacts);
      });
  };

  useEffect(() => {
    fetchProfPic();
  }, [isFocused]);

  // Has Notifications Logic
  const NUMNOTS = NOTIFICATIONS_DATA.length;

  useEffect(() => {
    NUMNOTS > 0 ? setHasNots(true) : setHasNots(false);
  }),
    [];

  // NOTIFICATIONS
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    notificationCount > 0 ? setYesNots(true) : setYesNots(false);
  }, [isFocused]);

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

  // Get Posts Content & User Posts FlatList
  const fetchContent = () => {
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
        console.log(content);
      });
  };

  useEffect(() => {
    fetchContent();
  }, [isFocused]);

  const Item = ({ title, picLink, category, content, userId }) => (
    <Pressable
      onPress={() => navigation.navigate("HubMyPosts")}
      style={{ marginTop: 10, marginRight: 20, maxWidth: 100 }}
    >
      <Image
        source={{ uri: picLink }}
        style={{ height: 120, width: 100, marginBottom: 5, borderRadius: 10 }}
      />
      <Text style={{ color: "white" }}>{title}</Text>
    </Pressable>
  );

  const renderItem = ({ item }) => (
    <Item title={item.data.title} picLink={item.data.picLink} />
  );

  // Icon Item
  const IconItem = ({ title, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        marginHorizontal: 10,
        width: 150,
        justifyContent: "space-between",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons
          name="person-circle-outline"
          size={24}
          color="white"
          style={{ marginRight: 6 }}
        />
        <Text style={{ color: "white" }}>{title}</Text>
      </View>
      <MaterialCommunityIcons name="dots-vertical" size={20} color="white" />
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.black }}
      showsVerticalScrollIndicator={false}
    >
      {data && (
        <View style={styles.screenStyle}>
          <StatusBar style="dark" />
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <View>
              <Pressable
                onPress={() => navigation.navigate("UpdateProfileImage")}
              >
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

            <Pressable
              onPress={() => navigation.navigate("BusinessCard")}
              style={{
                justifyContent: "center",
                marginRight: 40,
                marginLeft: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: "white",

                  textAlign: "center",
                }}
              >
                Your Profile
              </Text>
              <Text style={{ color: "lightgrey", textAlign: "center" }}>
                The{" "}
                <Text style={{ color: COLORS.mainGreen, fontWeight: "700" }}>
                  UNIS
                </Text>{" "}
                Way
              </Text>
            </Pressable>
            {!yesNots ? (
              <Pressable
                onPress={() => navigation.navigate("ExpiringInformation")}
              >
                <Ionicons
                  name="notifications"
                  size={26}
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
                  size={26}
                  color={COLORS.mainGreen}
                  style={{ marginRight: 10 }}
                />
              </Pressable>
            )}
          </View>

          {/* Profile Information Top */}
          <View style={{ marginHorizontal: 40, marginTop: 20 }}>
            <Text style={{ color: COLORS.mainGreen }}>Name</Text>
            <Text style={{ color: "white", fontSize: 18, fontWeight: "700" }}>
              {data?.firstName} {data?.surname}
            </Text>
            <View style={{ height: 10 }} />
            <Text style={{ color: COLORS.mainGreen }}>Profession</Text>
            <Text style={{ color: "white", fontSize: 18 }}>
              {data?.jobTitle}
            </Text>
            <View style={{ height: 10 }} />
            <Text style={{ color: COLORS.mainGreen }}>Bio</Text>
            <Text style={{ color: "white" }}>{data?.bio}</Text>
          </View>

          {/* Icons */}
          <View
            style={{ flexDirection: "row", alignSelf: "center", marginTop: 20 }}
          >
            <View style={{}}>
              <IconItem
                title="Connections"
                onPress={() => navigation.navigate("HubFriendsList")}
              />
              <IconItem
                title="Update Bio"
                onPress={() => navigation.navigate("CreateBio")}
              />
            </View>
            <View>
              <IconItem
                title="Your Posts"
                onPress={() => navigation.navigate("HubMyPosts")}
              />
              <IconItem
                title="Edit Profile"
                onPress={() => navigation.navigate("UpdateProfile")}
              />
            </View>
          </View>

          {/* User Posts */}
          <View style={{ margin: 10, marginTop: 20 }}>
            <Text style={{ color: "white", fontSize: 16 }}>
              Your{" "}
              <Text style={{ fontWeight: "700", color: COLORS.mainGreen }}>
                Hub
              </Text>{" "}
              Posts
            </Text>
            {content && (
              <FlatList
                data={content}
                renderItem={renderItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListHeaderComponent={() => (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("HubAddPost")}
                    style={{ marginTop: 10, marginRight: 20 }}
                  >
                    <View
                      style={{
                        height: 120,
                        width: 100,
                        borderWidth: 1,
                        borderColor: COLORS.mainGreen,
                        borderRadius: 12,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: COLORS.grey,
                      }}
                    >
                      <Ionicons
                        name="md-add-circle-outline"
                        size={32}
                        color={COLORS.mainGreen}
                      />
                    </View>
                    <Text
                      style={{
                        color: COLORS.lightGreen,
                        textAlign: "center",
                        marginTop: 5,
                      }}
                    >
                      Add New Post
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    backgroundColor: COLORS.black,
    paddingTop: 60,
  },
  headerContainer: {
    flexDirection: "row",
    marginHorizontal: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  bioContainer: {
    backgroundColor: COLORS.grey,
    alignSelf: "center",
    paddingHorizontal: 50,
    paddingVertical: 20,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: 20,
    width: 300,
    borderWidth: 1,
  },
  item1Style: {
    marginRight: 30,
    borderWidth: 2,

    // marginTop: -10,
  },
  item2Style: {
    backgroundColor: "#fafafa",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 6,
    marginRight: 30,
    marginTop: 10,
    borderWidth: 2,
    borderColor: COLORS.yellow,
  },
  item3Style: {
    marginRight: 30,
    marginTop: 10,
    borderWidth: 2,
    borderColor: COLORS.yellow,
    borderRadius: 8,
  },
});

export default Profile;
