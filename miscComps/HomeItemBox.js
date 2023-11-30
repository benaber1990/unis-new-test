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
    // backgroundColor: COLORS.grey,

    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 6,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
    width: 70,
    height: 70,
  },
});
