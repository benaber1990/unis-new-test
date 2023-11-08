import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import newlogo from "../assets/newlogo.png";

export default function UnisLogo({ height, width }) {
  return (
    <View>
      <Image
        source={newlogo}
        style={{ height: height, width: width, resizeMode: "contain" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
