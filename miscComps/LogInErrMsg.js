import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function LogInErrMsg() {
  return (
    <View>
      <Text
        style={{
          color: "tomato",
          textAlign: "center",
          fontSize: 12,
          marginBottom: 8,
        }}
      >
        Invalid Log In Attempt. Please enter your correct credentials
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({});
