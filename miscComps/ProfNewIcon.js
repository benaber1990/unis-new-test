import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../misc/COLORS";

export default function ProfNewIcon({ title, link, size, iconName, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.containerStyle}>
      <Ionicons
        name={iconName}
        size={size ? size : 24}
        color={COLORS.mainGreen}
      />
      <Text
        style={{
          color: "white",
          fontSize: 10,
          fontWeight: "700",
          textAlign: "center",
          //   marginTop: 5,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: COLORS.black,
    borderRadius: 6,
    alignSelf: "center",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
});
