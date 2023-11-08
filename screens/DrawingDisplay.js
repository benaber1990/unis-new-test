import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import COLORS from "../misc/COLORS";

export default function DrawingDisplay({ route }) {
  const { title, imageUrl } = route.params;

  return (
    <View style={styles.screenStyle}>
      {/* Title */}
      <Text style={styles.titleTextStyle}>{title}</Text>

      {/* Image */}
      <Image source={{ uri: imageUrl }} style={styles.imageStyle} />

      {/* Info Box */}
      <View style={styles.infoBoxContainer}>
        <Text
          style={{ fontSize: 16, fontWeight: "700", color: COLORS.lightGreen }}
        >
          Drawing Information
        </Text>
        <Text style={{ color: COLORS.lightGreen }}>
          Drawing Info can be displayed here.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    backgroundColor: COLORS.black,
    alignItems: "center",
    paddingTop: 80,
  },
  imageStyle: {
    height: 200,
    width: 300,
    borderRadius: 12,
  },
  titleTextStyle: {
    color: COLORS.mainGreen,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  infoBoxContainer: {
    backgroundColor: COLORS.grey,
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 20,
    width: 300,
  },
});
