import React from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import COLORS from "../misc/COLORS";
import EX_INDUCTIONS_DATA from "../misc/EX_INDUCTIONS_DATA";

export default function InductionsScreen({ navigation }) {
  const Item = ({ title, site, info }) => (
    <Pressable style={styles.itemStyle}>
      <Text style={{ fontSize: 16, fontWeight: "700" }}>{title}</Text>
      <Text>{site}</Text>

      <View>
        <Pressable
          onPress={() =>
            navigation.navigate("InductionDisplay", {
              title,
              site,
              info,
            })
          }
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 6,
            backgroundColor: COLORS.mainGreen,
            alignSelf: "flex-end",
          }}
        >
          <Text style={{ fontWeight: "700" }}>View Induction</Text>
        </Pressable>
      </View>
    </Pressable>
  );

  const renderItem = ({ item }) => (
    <Item title={item.title} site={item.title} info={item.info} />
  );

  return (
    <View style={styles.screenStyle}>
      <FlatList
        data={EX_INDUCTIONS_DATA}
        renderItem={renderItem}
        ListHeaderComponent={() => <View style={{ height: 30 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screenStyle: { flex: 1, alignItems: "center", backgroundColor: COLORS.black },
  itemStyle: {
    marginBottom: 30,
    backgroundColor: COLORS.lightGreen,
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderRadius: 6,
    width: 250,
  },
});
