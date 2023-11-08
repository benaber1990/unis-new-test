import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
} from "react-native";
import COLORS from "../misc/COLORS";
import EX_PERMITS from "../misc/EX_PERMITS";

export default function PermitsScreen({ navigation }) {
  const Item = ({ title, category, imgLink }) => (
    <Pressable
      onPress={() => navigation.navigate("PermitDisplay")}
      style={styles.itemStyle}
    >
      <Image
        source={{ uri: imgLink }}
        style={{
          height: 75,
          width: 100,
          borderRadius: 8,
          marginRight: 20,
          borderWidth: 2,
          borderColor: COLORS.black,
        }}
      />
      <View>
        <Text
          style={{
            color: "white",
            fontSize: 16,
            fontWeight: "700",
            marginBottom: 5,
          }}
        >
          {title}
        </Text>
        <View
          style={{
            backgroundColor: COLORS.black,
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderRadius: 6,
            borderWidth: 2,
            borderColor: COLORS.mainGreen,
          }}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>View Permit</Text>
        </View>
      </View>
    </Pressable>
  );

  const renderItem = ({ item }) => (
    <Item title={item.title} category={item.category} imgLink={item.imgLink} />
  );

  return (
    <View style={styles.screenStyle}>
      {/* FlatList  */}
      <FlatList
        data={EX_PERMITS}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={function () {
          return <View style={{ paddingTop: 20 }}></View>;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.black,
  },
  itemStyle: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    marginBottom: 30,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.grey,
    broderRadius: 8,
  },
});
