import React from "react";
import { View, Text, StyleSheet } from "react-native";
import COLORS from "../misc/COLORS";

export default function ExpensesList() {
  return (
    <View style={styles.screenStyle}>
      <Text style={{ fontSize: 22, fontWeight: "700", color: "white" }}>
        Scanned Receipts
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
});
