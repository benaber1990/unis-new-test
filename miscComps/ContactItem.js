import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import COLORS from "../misc/COLORS";
import { Feather } from "@expo/vector-icons";

export default function ContactItem({ title, phoneNumber, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingLeft: 20,
        backgroundColor: COLORS.mainGreen,
        borderRadius: 8,
        marginBottom: 25,
        borderRadius: 8,
      }}
    >
      <View style={styles.containerStyle}>
        <Text
          style={{ fontSize: 18, color: COLORS.lightGreen, fontWeight: "700" }}
        >
          {title}
        </Text>
        <View style={{ flexDirection: "row", marginTop: 15 }}>
          <Feather
            name="phone-call"
            size={24}
            color={COLORS.mainGreen}
            style={{ marginRight: 15 }}
          />
          <Text style={{ color: "white", fontSize: 18, fontWeight: "500" }}>
            03455 841 911
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: COLORS.grey,
    paddingVertical: 15,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    paddingLeft: 30,
    paddingRight: 40,
  },
});
