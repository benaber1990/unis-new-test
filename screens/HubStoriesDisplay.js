import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { FontAwesome, Feather } from "@expo/vector-icons";

export default function HubStoriesDisplay({ route, navigation }) {
  const { title, imageLink } = route.params;

  return (
    <ImageBackground
      source={{ uri: imageLink }}
      style={{
        flex: 1,
        height: "100%",
        width: "100%",
        justifyContent: "space-between",
      }}
    >
      {/* Top */}
      <View
        style={{
          alignItems: "center",
          marginTop: 30,
          backgroundColor: "lightgrey",
          opacity: 0.3,
          alignSelf: "center",
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 3,
        }}
      >
        <Text style={{ opacity: 1, fontWeight: "700" }}>
          Stories caption here
        </Text>
      </View>
      {/* Middle */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 20,
        }}
      >
        <TouchableOpacity>
          <FontAwesome name="chevron-left" size={32} color="lightgrey" />
        </TouchableOpacity>

        <TouchableOpacity>
          <FontAwesome name="chevron-right" size={32} color="lightgrey" />
        </TouchableOpacity>
      </View>

      {/* Bottom */}
      <View
        style={{
          alignItems: "center",
          marginBottom: 30,
          flexDirection: "row",
          alignSelf: "center",
        }}
      >
        <TextInput
          style={styles.textInputStyle}
          placeholder="Send message"
          placeholderTextColor={"lightgrey"}
        />
        <TouchableOpacity>
          <Feather name="send" size={24} color="lightgrey" />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screenStyle: {},
  textInputStyle: {
    height: 40,
    width: 270,
    // backgroundColor: "grey",
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "lightgrey",
    marginRight: 10,
    paddingLeft: 20,
    color: "white",
  },
});
