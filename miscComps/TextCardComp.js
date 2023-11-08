import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import COLORS from "../misc/COLORS";

export default function TextCardComp({
  backCol,
  title,
  body,
  link,
  buttonText,
  titleColor,
  bodyColor,
}) {
  return (
    <View
      style={{
        backgroundColor: backCol,
        borderRadius: 12,
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginTop: 20,
        marginHorizontal: 20,
      }}
    >
      <Text style={{ fontWeight: "700", color: titleColor }}>{title}</Text>
      <Text style={{ color: bodyColor, fontSize: 12 }}>{body}</Text>

      <Pressable onPress={link} style={styles.buttonStyle}>
        <Text style={styles.buttonTextStyle}>{buttonText}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  titleTextStyle: {},
  bodyTextStyle: {},
  buttonStyle: {
    backgroundColor: COLORS.mainGreen,
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginTop: 8,
  },
  buttonTextStyle: {
    // color: "white",
    fontWeight: "700",
  },
});
