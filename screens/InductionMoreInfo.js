import React from "react";
import { View, Text, StyleSheet } from "react-native";
import COLORS from "../misc/COLORS";

export default function InductionMoreInfo({ route }) {
  const { title, videoLink, infoHere, hasCompleted, message } = route.params;
  return (
    <View style={styles.screenStyle}>
      <Text
        style={{
          textAlign: "center",
          color: "white",
          marginBottom: 20,
          fontSize: 18,
          fontWeight: "700",
        }}
      >
        {title}
      </Text>

      <Text style={{ textAlign: "center", color: "white" }}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    backgroundColor: COLORS.black,
    alignItems: "center",
  },
});
