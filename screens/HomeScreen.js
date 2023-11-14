import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import COLORS from "../misc/COLORS";
import LATEST_NEWS_DATA from "../misc/LATEST_NEWS_DATA";
import { useNavigation } from "@react-navigation/native";
import firebase from "firebase/compat";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
// import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/auth";
import UnisLogo from "../components/UnisLogo";
import HomeItemBox from "../miscComps/HomeItemBox";
import TextCardComp from "../miscComps/TextCardComp";
import NOTIFICATIONS_DATA from "../misc/NOTIFICATIONS_DATA";
import { useIsFocused } from "@react-navigation/native";
import { useNotification } from "../context/NotificationsContext";

//FIREBASE CONFIG
// const firebaseConfig = {
//   apiKey: "AIzaSyChtonwBnG-Jzs-gMJRbTChiv-mwt13rNY",
//   authDomain: "unis-1.firebaseapp.com",
//   projectId: "unis-1",
//   storageBucket: "unis-1.appspot.com",
//   messagingSenderId: "500039576121",
//   appId: "1:500039576121:web:af595bd3bc72422d4fbbe8",
//   measurementId: "G-HY5WS3ZXYD",
// };

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APPID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// EXPO_PUBLIC_FIREBASE_API_KEY = "AIzaSyChtonwBnG-Jzs-gMJRbTChiv-mwt13rNY";
// EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN = "unis-1.firebaseapp.com";
// EXPO_PUBLIC_FIREBASE_PROJECT_ID = "unis-1";
// EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET = "unis-1.appspot.com";
// EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = "500039576121";
// EXPO_PUBLIC_FIREBASE_APPID = "1:500039576121:web:af595bd3bc72422d4fbbe8";
// EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID = "G-HY5WS3ZXYD";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState();
  const [hasNots, setHasNots] = useState("");
  const [contacts, setContacts] = useState([]);
  const [hasCreatedProfile, setHasCreatedProfile] = useState(true);
  const [yesNots, setYesNots] = useState(false);
  const navigationHndl = useNavigation();

  const isFocused = useIsFocused();

  // Render Content Delay
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    // Cleanup the timeout to avoid memory leaks
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        setUserId(authUser?.uid);
      } else {
        // User is signed out.
        setUser(null);
      }
    });

    // Clean up the listener when the component unmounts.
    return unsubscribe;
  }, []);

  if (!user) {
    navigationHndl.navigate("InitLogin");
  }

  const [text, setText] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // const { userEmail, logout } = useUser();

  const updatedData = LATEST_NEWS_DATA.filter((i) => i.title.includes(text));

  const [data, setData] = useState();

  const [userEmail, setUserEmail] = useState();
  const [jobTitle, setJobTitle] = useState();
  const [firstName, setFirstName] = useState();

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
      setHasCreatedProfile(data?.hasCreatedProfile);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isFocused]);

  const NUMNOTS = NOTIFICATIONS_DATA.length;

  useEffect(() => {
    NUMNOTS > 0 ? setHasNots(true) : setHasNots(false);
  }),
    [];

  const [testData, setTestData] = useState("");

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

  // Search Bar
  const [searchQuery, setSearchQuery] = useState("");

  // Filter the user list based on the search query
  const filteredUsers = contacts.filter((user) => {
    const userName = user.data.title.toLowerCase();
    return userName.includes(searchQuery.toLowerCase());
  });

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

  // FlatList
  const Item = ({ title, picLink, content }) => (
    <Pressable
      onPress={() =>
        navigation.navigate("ContentDisplay", {
          title: title,
          picLink: picLink,
          content: content,
        })
      }
      style={{ marginBottom: 20, marginRight: 30 }}
    >
      <View style={styles.itemStyle}>
        <Image
          source={{ uri: picLink }}
          style={{
            height: 220,
            width: 220,
            borderRadius: 12,
          }}
        />
      </View>
      <View
        style={{
          backgroundColor: COLORS.grey,
          alignSelf: "center",
          borderWidth: 2,
          borderColor: COLORS.lightGreen,
          paddingVertical: 8,
          paddingHorizontal: 12,
          marginTop: -20,
          borderRadius: 4,
        }}
      >
        <Text style={{ color: "white", fontWeight: "600" }}>{title}</Text>
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

  const { hasUnreadMessages } = useNotification();

  useEffect(() => {
    notificationCount > 0 ? setYesNots(true) : setYesNots(false);
  }, [isFocused]);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      {data && (
        <Pressable onPress={Keyboard.dismiss} style={styles.screenStyle}>
          <StatusBar style="dark" />

          {/* Header Section */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginHorizontal: 30,
            }}
          >
            <View style={{}}>
              <Image
                source={require("../assets/unislogo.gif")}
                style={{ height: 75, width: 75, resizeMode: "contain" }}
              />
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
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

              <Pressable onPress={() => navigation.navigate("Profile")}>
                <Image
                  source={{ uri: data?.profPic }}
                  style={{
                    height: 60,
                    width: 60,
                    borderRadius: 30,
                    borderWidth: 2,
                    borderColor: COLORS.mainGreen,
                  }}
                />
              </Pressable>
            </View>
          </View>

          {/* Home Welcome Message */}
          <View
            style={{
              marginLeft: 40,
              marginTop: 20,
              marginBottom: 30,
            }}
          >
            <Text style={{ color: "white", fontSize: 22, fontWeight: "700" }}>
              <Text style={{ fontWeight: "300" }}>Welcome,</Text>{" "}
              {data?.firstName}
            </Text>
          </View>

          {/* Search Box */}
          <ScrollView>
            {/* Search Box Label */}
            <View>
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  marginBottom: 5,
                  fontWeight: "300",
                  // fontSize: 12,
                }}
              >
                Search the{" "}
                <Text style={{ color: COLORS.mainGreen, fontWeight: "700" }}>
                  Unis<Text style={{ fontWeight: "400" }}>verse</Text>
                </Text>
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignSelf: "center",
                marginBottom: 5,
              }}
            >
              <TextInput
                placeholder="Enter Your Search Here"
                placeholderTextColor={"lightgrey"}
                style={styles.textInputStyle}
                value={searchQuery}
                onChangeText={(t) => setSearchQuery(t)}
              />
              <View
                style={{
                  justifyContent: "center",
                  backgroundColor: COLORS.grey,
                  paddingRight: 15,
                  marginLeft: -3,
                  borderTopRightRadius: 12,
                  borderBottomRightRadius: 12,
                }}
              >
                <Ionicons
                  name="globe-outline"
                  size={28}
                  color={COLORS.mainGreen}
                />
              </View>
            </View>

            {/* Home 4 Tiles */}

            <View
              style={{
                marginTop: 20,
                flexDirection: "row",
                // alignSelf: "center",
                justifyContent: "space-between",
                marginHorizontal: 20,
              }}
            >
              <HomeItemBox
                title="HR"
                iconName="ios-people-outline"
                link={() => navigation.navigate("HRScreen")}
              />
              <HomeItemBox
                title="H&S"
                iconName="fitness"
                link={() => navigation.navigate("HealthSafetyScreen")}
              />
              <HomeItemBox
                title="Docs"
                iconName="md-document-outline"
                link={() => navigation.navigate("DocsComingSoon")}
              />
              <HomeItemBox
                title="Site"
                iconName="hammer-outline"
                link={() => navigation.navigate("SiteScreen")}
              />
            </View>
            <View style={{ height: 20 }} />

            {/* FlatList 1 */}
            {contacts && (
              <FlatList
                data={filteredUsers.length > 0 ? filteredUsers : contacts}
                renderItem={renderItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListHeaderComponent={() => <View style={{ marginLeft: 20 }} />}
              />
            )}

            {/* Share Profile Box */}

            <Pressable
              onPress={() => navigation.navigate("QR")}
              style={{
                flexDirection: "row",
                alignSelf: "center",
                marginTop: 5,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  borderWidth: 2,
                  borderColor: COLORS.mainGreen,
                  marginHorizontal: 20,
                  justifyContent: "center",
                  paddingHorizontal: 30,
                  borderRadius: 8,
                  paddingVertical: 20,
                  backgroundColor: COLORS.grey,
                }}
              >
                <MaterialIcons
                  name="qr-code-2"
                  size={36}
                  color={COLORS.mainGreen}
                />
                <Text style={{ color: "white", fontWeight: "600" }}>
                  Share Profile
                </Text>
              </View>
            </Pressable>

            {/* Text Card 1 */}
            <TextCardComp
              backCol={COLORS.lightGreen}
              title={"Build Your UNIS Profile"}
              body={
                "Your UNIS profiles gives site managers instant access to your info - so you can always provide your eligibility to work"
              }
              link={() => navigation.navigate("Profile")}
              buttonText={"Update Now"}
            />

            {/* FlatList 2 */}
            <View style={{ height: 20 }} />
            {contacts && (
              <FlatList
                data={contacts}
                renderItem={renderItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListHeaderComponent={() => <View style={{ marginLeft: 20 }} />}
              />
            )}

            {/* Text Card 2 */}
            <TextCardComp
              backCol={COLORS.grey}
              title={"Explore App & Website Integration Features"}
              body={
                "Find out how the UNIS app seemlessly integrates with the UNIS Website Portal to help you power your construction projects"
              }
              link={() => navigation.navigate("ContactScreen")}
              buttonText={"Book a Demo"}
              titleColor={"white"}
              bodyColor={"white"}
            />

            {/* FlatList 3 */}
            <View style={{ height: 20 }} />
            {contacts && (
              <FlatList
                data={contacts}
                renderItem={renderItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListHeaderComponent={() => <View style={{ marginLeft: 20 }} />}
              />
            )}

            {/* <Pressable
            // onPress={async () => {
            //   const user = await login();
            //   setUser(user.email);
            // }}
            >
              <Text style={{ color: "white" }}>Click</Text>
            </Pressable> */}
          </ScrollView>
        </Pressable>
      )}

      {!data && isVisible && (
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
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    backgroundColor: COLORS.black,
    paddingTop: 40,
    // flex: 1,
  },
  homeCardContainer: {
    alignSelf: "center",
    flexDirection: "row",
    borderRadius: 12,
    backgroundColor: COLORS.black,
  },
  textInputStyle: {
    height: 60,
    width: 270,
    // borderRadius: 2,
    backgroundColor: COLORS.grey,
    alignSelf: "center",
    paddingLeft: 25,
    fontSize: 16,
    color: "white",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  itemStyle: {
    // marginRight: 30,

    backgroundColor: "black",
    borderWidth: 2,
    borderColor: COLORS.mainGreen,
    borderRadius: 12,
  },
});

export default HomeScreen;
