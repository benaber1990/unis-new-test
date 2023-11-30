import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import COLORS from "../misc/COLORS";

const tempProjects = [
  { id: "001", title: "Project A", location: "Liverpool", status: "Open" },
  { id: "002", title: "Project B", location: "Liverpool", status: "Open" },
  { id: "003", title: "Project C", location: "Liverpool", status: "Closed" },
  { id: "004", title: "Project D", location: "Liverpool", status: "Open" },
  { id: "005", title: "Project E", location: "Liverpool", status: "Closed" },
  { id: "006", title: "Project F", location: "Liverpool", status: "Open" },
];

export default function Projects({ navigation }) {
  const Item = ({ title, location, status }) => (
    <View
      style={{
        marginTop: 20,
        marginHorizontal: 10,
        padding: 10,
        borderRadius: 12,
        backgroundColor: COLORS.grey,
        alignSelf: "center",
        paddingVertical: 20,
      }}
    >
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ProjectDisplay", {
            title: title,
            location: location,
            status: status,
          })
        }
        style={{ marginHorizontal: 20 }}
      >
        <View
          style={{
            marginBottom: -60,
            height: 70,
            width: 70,
            borderTopRightRadius: 35,
            borderTopLeftRadius: 6,
            backgroundColor: status == "Open" ? COLORS.mainGreen : "lightgrey",
          }}
        ></View>
        <View
          style={{
            backgroundColor: status == "Open" ? COLORS.mainGreen : "lightgrey",
            paddingVertical: 20,
            // paddingHorizontal: 10,
            borderTopRightRadius: 6,
            borderBottomRightRadius: 6,
            borderBottomLeftRadius: 6,
            height: 110,
            width: 100,
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: "700", marginBottom: 3 }}>{title}</Text>
          <Text style={{ fontWeight: "300", fontSize: 12 }}>{location}</Text>
          <Text style={{ fontWeight: "300", fontSize: 12 }}>
            Members: <Text style={{ fontWeight: "700", fontSize: 12 }}>18</Text>
          </Text>
          <Text style={{ fontWeight: "700", fontSize: 12, marginTop: 5 }}>
            {status}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => (
    <Item title={item.title} location={item.location} status={item.status} />
  );

  return (
    <View style={styles.screenStyle}>
      <Text>Projects</Text>

      <FlatList data={tempProjects} renderItem={renderItem} numColumns={2} />
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
