import React from "react";
import { View, Text, StyleSheet } from "react-native";
import COLORS from "../misc/COLORS";
import { FontAwesome } from "@expo/vector-icons";

export default function ComingSoonIcon({ title }) {
  return (
    <View style={styles.containerStyle}>
      <View style={{ flexDirection: "row" }}>
        <Text
          style={{
            color: "white",
            fontWeight: "700",
            fontSize: 16,
            marginRight: 15,
          }}
        >
          {title}
        </Text>
        <FontAwesome
          name="lock"
          size={24}
          color={COLORS.lightGreen}
          style={{ marginLeft: 15 }}
        />
      </View>

      <View style={styles.smallButStyle}>
        <Text style={{ fontSize: 12, color: "white", fontWeight: "600" }}>
          Coming Soon
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: COLORS.grey,
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginHorizontal: 10,
    width: 170,
  },
  smallButStyle: {
    alignSelf: "flex-end",
    marginTop: 10,
    backgroundColor: COLORS.black,
    borderWidth: 2,
    borderColor: COLORS.mainGreen,
    borderRadius: 3,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});
