import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import COLORS from "../misc/COLORS";

function NotDisplayListing({ navigation, route }) {
  const { title, category, message } = route.params;

  return (
    <View style={styles.screenStyle}>
      <View>
        <Text
          style={{
            color: "white",
            fontSize: 18,
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            color: "white",
            // fontSize: 18,
            // fontWeight: "700",
            textAlign: "center",
          }}
        >
          Category: <Text style={{ fontWeight: 700 }}>{category}</Text>
        </Text>
        <Text
          style={{
            color: "white",
            fontSize: 16,
            // fontWeight: "700",
            textAlign: "center",
            marginVertical: 20,
          }}
        >
          {message}
        </Text>
        <Text
          style={{
            color: "white",
            fontSize: 18,
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          Due Date:
        </Text>
        {/* <Text style={{ color: "white" }}>{documentId}</Text> */}
      </View>

      <Pressable
        onPress={() => navigation.navigate("Profile")}
        style={{
          paddingVertical: 10,
          paddingHorizontal: 25,
          borderRadius: 8,
          backgroundColor: COLORS.grey,
          marginTop: 20,
        }}
      >
        <Text style={{ color: COLORS.mainGreen, fontWeight: 700 }}>
          View My Documents
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    paddingTop: 60,
    alignItems: "center",
    backgroundColor: COLORS.black,
    flex: 1,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "500",
    color: "white",
  },
});

export default NotDisplayListing;
