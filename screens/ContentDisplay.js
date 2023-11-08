import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import COLORS from "../misc/COLORS";
import EX_BLOG_POST from "../misc/EX_BLOG POST";

const dummyUrl =
  "https://images.pexels.com/photos/448828/pexels-photo-448828.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

function ContentDisplay({ route }) {
  return (
    <ScrollView>
      <View style={styles.screenStyle}>
        <StatusBar style="dark" />

        {/* Image */}
        <Image
          source={{ uri: dummyUrl }}
          style={{ width: 300, height: 200, borderRadius: 12 }}
        />

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleStyle}>7 Ways You Can Be Safer on Site</Text>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <Text style={{ fontSize: 16 }}>{EX_BLOG_POST}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    backgroundColor: COLORS.black,
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
  },
  titleContainer: {
    marginHorizontal: 30,
  },
  titleStyle: {
    fontSize: 32,
    fontWeight: "500",
    marginTop: 20,
    color: "white",
    textAlign: "center",
  },
  contentContainer: {
    padding: 20,
    borderRadius: 8,
    backgroundColor: "#fafafa",
    marginTop: 20,
    marginBottom: 20,
  },
});

export default ContentDisplay;
