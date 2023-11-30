import React from "react";
import { View, Text, StyleSheet } from "react-native";
import COLORS from "../misc/COLORS";

export default function HubAddFriend() {
  return (
    <View style={styles.screenStyle}>
      <Text>Hub Add Friend</Text>

      <View style={styles.messageCard}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    backgroundColor: COLORS.black,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 60,
  },
  messageCard: {
    height: 300,
    width: 300,
    borderRadius: 8,
    backgroundColor: "#FDFDFD",
    alignItems: "center",
    justifyContent: "center",
  },
});
