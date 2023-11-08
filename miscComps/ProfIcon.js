import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import COLORS from "../misc/COLORS";
import { FontAwesome } from "@expo/vector-icons";
export default function ProfIcon({ title, link, iconName }) {
  return (
    <Pressable onPress={link} style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
          alignSelf: "center",
          justifyContent: "space-evenly",
          width: "100%",
        }}
      >
        <Text style={{ color: "white", marginRight: 10, fontWeight: "600" }}>
          {title}
        </Text>
        <FontAwesome
          name={iconName}
          size={24}
          color={COLORS.mainGreen}
          style={{ marginLeft: 10 }}
        />
      </View>
      <View
        style={{
          alignSelf: "flex-end",
          marginTop: 20,
          backgroundColor: COLORS.black,
          paddingHorizontal: 8,
          paddingVertical: 6,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: COLORS.mainGreen,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 10,
          }}
        >
          View All
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.grey,
    padding: 20,
    borderRadius: 6,
    marginHorizontal: 10,
    marginBottom: 10,
    width: 150,
  },
});
