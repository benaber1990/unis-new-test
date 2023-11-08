import React from "react";
import { View, Text, StyleSheet } from "react-native";
import COLORS from "../misc/COLORS";

function NotDisplayListing({ route }) {
  const { alertTitle, alertCat } = route.params;

  return (
    <View style={styles.screenStyle}>
      <Text style={styles.titleText}>Title display goes here</Text>
      <View>
        <Text style={{ color: "white" }}>{alertTitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    paddingTop: 60,
    alignItems: "center",
    backgroundColor: COLORS.black,
    flex: 1,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "500",
    color: "white",
  },
});

export default NotDisplayListing;
