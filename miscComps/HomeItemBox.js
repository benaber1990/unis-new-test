import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../misc/COLORS";

export default function HomeItemBox({ title, link, iconName }) {
  return (
    <TouchableOpacity style={styles.containerStyle} onPress={link}>
      <Ionicons name={iconName} size={32} color={COLORS.mainGreen} />
      <Text
        style={{
          color: "white",
          fontSize: 12,
          fontWeight: "600",
          marginTop: 5,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: COLORS.grey,
    borderRadius: 6,
    alignSelf: "center",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
});
