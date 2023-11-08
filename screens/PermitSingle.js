import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import COLORS from "../misc/COLORS";

export default function PermitSingle({ route }) {
  const { title, imgLink, category } = route.params;

  return (
    <View style={styles.screenStyle}>
      {/* Title */}
      <Text style={{ color: "white", fontSize: 18, fontWeight: "700" }}>
        {title}
      </Text>

      {/* Image */}
      <View>
        <Image
          source={{ uri: imgLink }}
          style={{ height: 200, width: 300, borderRadius: 6, marginTop: 20 }}
        />
      </View>

      {/* Information Box */}
      <View style={styles.infoContainer}>
        <Text style={{ color: "white" }}>Info Here</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    backgroundColor: COLORS.black,
    alignItems: "center",
    paddingTop: 60,
  },
  infoContainer: {
    padding: 20,
    backgroundColor: COLORS.grey,
    borderRadius: 8,
    marginTop: 40,
    width: 300,
  },
});
