import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../misc/COLORS";

export default function ProfNewIcon({ title, link, iconName, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.containerStyle}>
      <Ionicons name={iconName} size={32} color={COLORS.lightGreen} />
      <Text
        style={{
          color: COLORS.mainGreen,
          fontSize: 12,
          fontWeight: "600",
          //   marginTop: 5,
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: COLORS.grey,
    borderRadius: 6,
    alignSelf: "center",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
});
