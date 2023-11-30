import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import COLORS from "../misc/COLORS";

export default function HubAddStory() {
  return (
    <View style={styles.screenStyle}>
      <Text>Hub Add Story</Text>

      <TouchableOpacity>
        <Text style={{ color: COLORS.mainGreen, fontSize: 18 }}>
          Select Image
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    backgroundColor: COLORS.black,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 120,
  },
});
