import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import COLORS from "../misc/COLORS";
import Animated, {
  SlideInRight,
  SlideInDown,
  SlideOutLeft,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";

export default function DocumentDisplay({ navigation, route }) {
  const {
    title,
    imageUrl,
    expiryDate,
    statusText,
    documentId,
    daysDifference,
  } = route.params;

  const navigationHndl = useNavigation();

  useEffect(() => {
    console.log(documentId);
  }, []);
  return (
    <View style={styles.screenStyle}>
      <Animated.View
        entering={SlideInRight.duration(700)}
        exiting={SlideOutLeft}
      >
        <Image
          source={{ uri: imageUrl }}
          style={{
            width: 300,
            height: 375,
            marginBottom: 20,
            borderWidth: 3,
            borderColor: COLORS.mainGreen,
            borderRadius: 12,
          }}
        />
      </Animated.View>

      <Animated.View entering={SlideInDown.duration(700)}>
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

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("DeleteDocumentConfirm", {
              title,
              imageUrl,
              documentId,
            })
          }
          style={{ marginTop: 15 }}
        >
          <Text style={{ color: "grey" }}>Remove Certificate</Text>
        </TouchableOpacity>
      </Animated.View>
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
