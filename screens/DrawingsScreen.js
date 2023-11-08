import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import COLORS from "../misc/COLORS";
import EX_DRAWINGS_DATA from "../misc/EX_DRAWINGS_DATA";

export default function DrawingsScreen({ navigation }) {
  const Item = ({ title, imageUrl }) => (
    <Pressable
      onPress={() =>
        navigation.navigate("DrawingDisplay", {
          title,
          imageUrl,
        })
      }
      style={styles.itemStyle}
    >
      <Image
        source={{ uri: imageUrl }}
        style={{ height: 120, width: 120, borderRadius: 12, marginBottom: 10 }}
      />
      <Text
        style={{ color: COLORS.mainGreen, fontWeight: "700", fontSize: 16 }}
      >
        {title}
      </Text>
    </Pressable>
  );

  const renderItem = ({ item }) => (
    <Item title={item.title} imageUrl={item.imageUrl} />
  );

  return (
    <View style={styles.screenStyle}>
      <FlatList
        data={EX_DRAWINGS_DATA}
        renderItem={renderItem}
        numColumns={2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    backgroundColor: COLORS.black,
    alignItems: "center",
  },
  itemStyle: {
    marginHorizontal: 15,
    marginVertical: 20,
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: COLORS.grey,
    borderRadius: 8,
    alignItems: "center",
  },
});
