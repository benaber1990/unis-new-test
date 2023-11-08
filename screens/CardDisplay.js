import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import COLORS from "../misc/COLORS";

export default function CardDisplay({ route }) {
  const { title, imageUrl, expiryDate } = route.params;
  return (
    <View style={styles.screenStyle}>
      <View style={{ marginHorizontal: 30 }}>
        <Image
          style={{
            width: "100%",
            height: 200,
            marginBottom: 30,
            borderRadius: 18,
          }}
          source={{ uri: imageUrl }}
        />
      </View>
      <Text
        style={{
          textAlign: "center",
          color: "white",
          fontWeight: "700",
          fontSize: 18,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          color: "white",
          marginTop: 20,
          textAlign: "center",
        }}
      >
        Expiry Date: {expiryDate}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    backgroundColor: COLORS.black,
    paddingTop: 20,
  },
});
