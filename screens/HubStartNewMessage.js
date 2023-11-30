import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import COLORS from "../misc/COLORS";

export default function HubStartNewMessage() {
  return (
    <View style={styles.screenStyle}>
      <Text>Start New Message</Text>
      <TextInput
        style={styles.textInputStyle}
        placeholder="Search connections to message"
        placeholderTextColor={"lightgrey"}
      />

      <Text
        style={{
          color: "white",
          alignSelf: "flex-start",
          marginTop: 40,
          marginLeft: 30,
        }}
      >
        Recent Contacts
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    backgroundColor: COLORS.black,
    alignItems: "center",
  },
  textInputStyle: {
    height: 60,
    width: 300,
    borderRadius: 30,
    backgroundColor: COLORS.grey,
    fontSize: 16,
    paddingHorizontal: 20,
  },
});
