import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import COLORS from "../misc/COLORS";

const demoData = [
  {
    id: "1",
    sender: "John Doe",
    timestamp: "2023-11-22T10:30:00Z",
    message:
      "Started excavation work at the construction site. Progress is good so far!",
  },
  {
    id: "2",
    sender: "Alice Smith",
    timestamp: "2023-11-22T12:15:00Z",
    message:
      "Delivered construction materials to the site. Ready for the next phase.",
  },
  {
    id: "3",
    sender: "Bob Johnson",
    timestamp: "2023-11-22T14:45:00Z",
    message: "Installed framework for the building. Everything is on schedule.",
  },
  {
    id: "4",
    sender: "Emily White",
    timestamp: "2023-11-22T16:20:00Z",
    message:
      "Electrical wiring completed in the west wing. Moving on to the east wing.",
  },
  {
    id: "5",
    sender: "David Brown",
    timestamp: "2023-11-22T18:00:00Z",
    message: "Concrete pouring finished for the first floor. Solid foundation!",
  },
  {
    id: "6",
    sender: "Grace Taylor",
    timestamp: "2023-11-22T20:30:00Z",
    message:
      "Roofing materials delivered. Roof installation starts tomorrow morning.",
  },
  {
    id: "7",
    sender: "Sam Wilson",
    timestamp: "2023-11-22T22:00:00Z",
    message:
      "Completed plumbing work in the basement. No leaks, all systems go!",
  },
  {
    id: "8",
    sender: "Eva Martinez",
    timestamp: "2023-11-22T23:45:00Z",
    message:
      "Painting the exterior walls. The project is really taking shape now!",
  },
];

const windowWidth = Dimensions.get("window").width;

const tempLink =
  "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

export default function ProjectDisplay({ route, navigation }) {
  const { title, location, status } = route.params;

  // Updates Primary FlatList
  const Item = ({ sender, timestamp, message }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ProjectItemDisplay", {
          sender,
          message,
          timestamp,
        })
      }
      style={{
        width: windowWidth - 10,
        paddingVertical: 20,
        backgroundColor: COLORS.grey,
        marginBottom: 4,
        paddingHorizontal: 30,
        flexDirection: "row",
      }}
    >
      <View>
        <Text style={{ color: "grey" }}>{sender} sent </Text>
        <Text style={{ color: "lightgrey" }}>{message}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <Item
      sender={item.sender}
      timestamp={item.timestamp}
      message={item.message}
    />
  );

  // Other Team Members Secondary FlatList
  const Item2 = ({ sender, message, timestamp }) => (
    <View style={{ marginRight: 20 }}>
      <Image
        source={{ uri: tempLink }}
        style={{
          height: 60,
          width: 60,
          borderRadius: 30,
          borderWidth: 2,
          borderColor: COLORS.mainGreen,
        }}
      />
    </View>
  );

  const renderItem2 = ({ item }) => (
    <Item2
      sender={item.sender}
      message={item.message}
      timestamp={item.timestamp}
    />
  );

  // FlatList 3 - Projects Gallery

  const Item3 = ({ sender }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("ProjectGallery")}
      style={{ marginRight: 20 }}
    >
      <Image
        source={{ uri: tempLink }}
        style={{ height: 100, width: 80, borderRadius: 8 }}
      />
    </TouchableOpacity>
  );

  const renderItem3 = ({ item }) => <Item3 sender={item.sender} />;

  return (
    <View style={styles.screenStyle}>
      <Text>Project Display</Text>

      <Text>{title}</Text>

      <FlatList
        data={demoData}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View>
            <Text
              style={{
                color: "lightgrey",
                fontSize: 14,
                marginBottom: 10,
                marginLeft: 20,
                // marginTop: 20,
              }}
            >
              Team Members on this Project
            </Text>
            <FlatList
              data={demoData}
              renderItem={renderItem2}
              horizontal
              showsHorizontalScrollIndicator={false}
              ListHeaderComponent={() => <View style={{ marginLeft: 20 }} />}
            />
            <View style={{ height: 20 }} />
            <Text
              style={{
                color: "lightgrey",
                fontSize: 14,
                marginBottom: 10,
                marginLeft: 20,
                // marginTop: 20,
              }}
            >
              Project Gallery
            </Text>
            <FlatList
              data={demoData}
              renderItem={renderItem3}
              horizontal
              showsHorizontalScrollIndicator={false}
              ListHeaderComponent={() => <View style={{ marginLeft: 20 }} />}
            />
            <Text
              style={{
                color: "lightgrey",
                fontSize: 16,
                marginBottom: 10,
                marginLeft: 20,
                marginTop: 20,
              }}
            >
              Project Updates
            </Text>
          </View>
        )}
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
});
