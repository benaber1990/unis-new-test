import React from "react";
import { View, Text, StyleSheet } from "react-native";
import COLORS from "../misc/COLORS";

export default function UnisFooter1() {
  return (
    <View style={styles.containerStyle}>
      <Text
        style={{
          color: "white",
          marginBottom: 15,
          fontSize: 12,
          fontWeight: "600",
        }}
      >
        Powered by
        <Text
          style={{
            color: COLORS.mainGreen,
            fontWeight: "700",
          }}
        >
          {" "}
          UNIS.{" "}
        </Text>
        All rights reserved. 2023
      </Text>

      <Text style={{ color: "white", fontSize: 18, fontWeight: "700" }}>
        Fast<Text style={{ color: COLORS.mainGreen }}>. </Text>Simple
        <Text style={{ color: COLORS.mainGreen }}>. </Text>Secure
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    alignItems: "center",
  },
});
