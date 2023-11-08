import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import COLORS from "../misc/COLORS";

export default function DocumentDisplay({ route }) {
  const { title, imageUrl } = route.params;
  return (
    <View style={styles.screenStyle}>
      <Image
        source={{ uri: imageUrl }}
        style={{ width: 300, height: 375, marginBottom: 20 }}
      />
      <Text
        style={{
          color: "white",
          fontSize: 22,
          fontWeight: "600",
        }}
      >
        {title}
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
});
