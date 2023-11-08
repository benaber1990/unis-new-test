import React from "react";
import { View, Text, StyleSheet } from "react-native";
import COLORS from "../misc/COLORS";

export default function TCScreen() {
  return (
    <View style={styles.screenStyle}>
      <Text>TC Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
});
