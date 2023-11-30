import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from "react-native";
import COLORS from "../misc/COLORS";
import demoWorkMessages from "../misc/DEMO_MESSAGES";
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

export default function HubPostDisplay({ route, navigation }) {
  const { title, picLink, postId } = route.params;
  const [users, setUsers] = useState();
  const isFocused = useIsFocused();
  const [comment, setComment] = useState("");
  const { uid } = firebase.auth().currentUser;
  const [data, setData] = useState();

  // Get Poster Data

  // Fetch User Data
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

  // Post Comment
  const [commentsContent, setCommentsContent] = useState();

  const postToFirestore = async () => {
    try {
      const collectionRef = firebase
        .firestore()
        .collection("hubpostscontent")
        .doc(postId)
        .collection("comments")
        .doc();

      const timestamp = firebase.firestore.FieldValue.serverTimestamp();

      await collectionRef.set({
        post: "post",
        comment: comment,
        message: "sdjfklsdf",
        posterId: uid,
        commentId: collectionRef.id,
        timestamp: timestamp,
        fullName: data?.firstName + " " + data?.surname || "",
        profPic: data?.profPic || "",
      });
      console.log("Data added to Firestore");
      setComment("");
      fetchCommentsContent();
    } catch (error) {
      console.log("Error", error);
    }
  };

  // Fetch Comments Content
  const fetchCommentsContent = () => {
    firebase
      .firestore()
      .collection("hubpostscontent")
      .doc(postId)
      .collection("comments")
      .orderBy("timestamp", "desc")
      .get()
      .then((querySnapshot) => {
        const commentsArray = [];
        querySnapshot.forEach((doc) => {
          commentsArray.push({
            data: doc.data(),
          });
        });
        const sortedComments = commentsArray.sort(
          (a, b) => b.data.timestamp - a.data.timestamp
        );
        setCommentsContent(sortedComments);
        console.log(sortedComments);
      });
  };

  useEffect(() => {
    fetchCommentsContent();
  }, []);

  // Fetch users
  const [showAddPost, setShowAddPost] = useState(false);

  // Comments FlatList
  const Item = ({ comment, message, post, profPic, fullName }) => (
    <View
      style={{
        width: windowWidth - 0,
        // paddingHorizontal: 20,
        paddingVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: COLORS.grey,
        marginBottom: 4,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Image
        source={{ uri: profPic }}
        style={{ height: 40, width: 40, borderRadius: 20, marginRight: 10 }}
      />
      <View style={{ marginRight: 40 }}>
        <Text style={{ color: "darkgrey", fontWeight: "700", fontSize: 12 }}>
          {fullName} <Text style={{ fontWeight: "300" }}>replied...</Text>
        </Text>
        <Text style={{ color: "white", marginTop: 3 }}>{comment}</Text>
      </View>
    </View>
  );

  const renderItem = ({ item }) => (
    <Item
      post={item.data.post}
      comment={item.data.comment}
      message={item.data.post}
      fullName={item.data.fullName}
      profPic={item.data.profPic}
    />
  );

  return (
    <View style={styles.screenStyle}>
      {/* Commments */}
      <View style={{ alignItems: "center" }}>
        <Image source={{ uri: picLink }} style={styles.imageStyle} />
        <Text
          style={{
            marginTop: 10,
            color: "lightgrey",
            fontSize: 22,
            fontWeight: "700",
            marginBottom: 10,
          }}
        >
          {title}
        </Text>
        <View style={{ marginBottom: 10, alignItems: "center" }}>
          <View>
            <Text style={{ color: "lightgrey" }}>Add Your Reply...</Text>
            <TextInput
              style={styles.textInputStyle}
              placeholder="Type your comment here"
              placeholderTextColor={"lightgrey"}
              value={comment}
              onChangeText={(t) => setComment(t)}
            />
            <TouchableOpacity
              onPress={postToFirestore}
              style={{
                backgroundColor: COLORS.mainGreen,
                alignItems: "center",
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 4,
                alignSelf: "center",
                // paddingHorizontal: 4,
              }}
            >
              <Text>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {commentsContent && (
        <FlatList
          data={commentsContent}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => <View />}
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
  imageStyle: {
    width: windowWidth,
    height: 170,
  },
  textInputStyle: {
    height: 50,
    width: 300,
    // backgroundColor: "pink",
    marginVertical: 8,
    borderRadius: 6,
    color: "white",
    borderWidth: 1,
    borderColor: "white",
    paddingLeft: 20,
    paddingRight: 10,
  },
});
