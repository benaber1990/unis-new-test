import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import COLORS from "../misc/COLORS";

export default function DocumentDisplay({ route }) {
  const { title, imageUrl, expiryDate, statusText, daysDifference } =
    route.params;
  return (
    <View style={styles.screenStyle}>
      <Image
        source={{ uri: imageUrl }}
        style={{
          width: 300,
          height: 375,
          marginBottom: 20,
          borderWidth: 3,
          borderColor: COLORS.mainGreen,
        }}
      />
      <Text
        style={{
          color: "white",
          fontSize: 22,
          fontWeight: "600",
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          color: "white",
          fontSize: 14,
          fontWeight: "400",
          marginTop: 10,
        }}
      >
        Expiry Date: <Text style={{ fontWeight: "700" }}>{expiryDate}</Text>
      </Text>
      <Text
        style={{
          color: "white",
          fontSize: 14,
          fontWeight: "400",
          marginVertical: 5,
        }}
      >
        Days until Expiry:{" "}
        <Text style={{ fontWeight: "700" }}>{daysDifference}</Text>
      </Text>
      <Text
        style={{
          color: "tomato",
          fontSize: 14,
          fontWeight: "700",
        }}
      >
        {statusText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    backgroundColor: COLORS.black,
    alignItems: "center",
  },
});
