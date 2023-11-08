import React, { useState, useEffect } from "react";
import {
  Button,
  View,
  StyleSheet,
  Text,
  FlatList,
  Pressable,
  Image,
  ImageBackground
} from "react-native";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";
import EX_CARDS from "../misc/EX_CARDS";

import COLORS from "../misc/COLORS";

// import firebase from "firebase/compat/app";
import firebase from "firebase/compat";
import "firebase/compat/database";
import "firebase/auth";
import { useIsFocused } from "@react-navigation/native";

export default function ExmapleAnimate() {
    const { uid } = firebase.auth().currentUser;

    const [contacts, setContacts] = useState("");

    const isFocused = useIsFocused();

     // Firebase User Info
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
      // console.log(user.uid);
    });

    return () => unsubscribe();
  }, []);

    // Fetch Cards
    const fetchDocPics = () => {
        firebase
          .firestore()
          .collection("users")
          .doc(uid)
          .collection("cards")
          .get()
          .then((querySnapshot) => {
            const contactsArray = [];
            querySnapshot.forEach((doc) => {
              contactsArray.push({
                data: doc.data(),
              });
            });
            setContacts(contactsArray);
            console.log("success!", contacts);
          });
      };
    
      useEffect(() => {
        fetchDocPics();
      }, [isFocused]);

  const [hasPressed, setHasPressed] = useState(false);

  const marginVal = useSharedValue(-20);

  const handlePress = () => {
    setHasPressed(true);
    marginVal.value += 30;
  };

  const animatedStyles = useAnimatedStyle(() => ({
    marginBottom: withSpring(marginVal.value * 2),
  }));

  //   FlatList
  const Item = ({ title, imageUrl }) => (
    <Animated.View
      style={[
        {
          paddingHorizontal: 30,
          paddingVertical: 30,
          backgroundColor: "pink",
          //   marginBottom: 20,
        },
        animatedStyles,
      ]}
    >
      <Pressable onPress={handlePress}>
        <Text>{title}</Text>
      </Pressable>
    </Animated.View>
  );

  const renderItem = ({ item }) => (
    <Item title={item.data.title} imageUrl={item.data.imageUrl} />
  );

  //   const ExItem = () => (
  //     <Animated.View
  //       style={[
  //         {
  //           paddingHorizontal: 30,
  //           paddingVertical: 30,
  //           backgroundColor: "pink",
  //           //   marginBottom: 20,
  //         },
  //         animatedStyles,
  //       ]}
  //     >
  //       <Text>Ex Item</Text>
  //     </Animated.View>
  //   );

  return (
    <View style={styles.container}>
      {contacts && <FlatList
        data={EX_CARDS}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => <View style={{ height: 30 }}></View>}
      />}

      {!hasPressed ? <Button onPress={handlePress} title="Click me" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    height: 120,
    width: 120,
    backgroundColor: "#b58df1",
    borderRadius: 20,
    marginVertical: 50,
  },
});
