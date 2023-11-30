import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import COLORS from "../misc/COLORS";
import demoWorkMessages from "../misc/DEMO_MESSAGES";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;

export default function HubMessages() {
  const navigationHndl = useNavigation();
  const [selectedTab, setSelectedTab] = useState("all");
  const [messages, setMessages] = useState(demoWorkMessages);

  const hubFriendChatHandler = () => navigationHndl.navigate("HubFriendChat");

  // Function to filter messages based on the selected tab
  const filteredMessages = () => {
    switch (selectedTab) {
      case "unread":
        return messages.filter((message) => !message.isRead);
      case "read":
        return messages.filter((message) => message.isRead);
      default:
        return messages;
    }
  };

  // FlatList
  const Item = ({ senderName, message, timestamp, isRead }) => (
    <TouchableOpacity
      onPress={hubFriendChatHandler}
      style={[
        styles.itemStyle,
        {
          backgroundColor: isRead ? COLORS.grey : COLORS.mainGreen,
        },
      ]}
    >
      <View style={{ flexDirection: "row" }}>
        <Image
          source={{
            uri: "https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          }}
          style={{ height: 30, width: 30, borderRadius: 20, marginRight: 10 }}
        />
        <View>
          <Text
            style={{
              fontWeight: "700",
              color: isRead ? "white" : COLORS.black,
            }}
          >
            {senderName}
          </Text>
          <Text
            style={{ color: isRead ? "darkgrey" : COLORS.grey, fontSize: 12 }}
          >
            Message content can go here
          </Text>
        </View>
      </View>
      <MaterialCommunityIcons
        name="send"
        size={24}
        color={isRead ? "white" : COLORS.black}
      />
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <Item
      isRead={item.isRead}
      senderName={item.senderName}
      message={item.message}
      timestamp={item.timestamp}
    />
  );

  return (
    <View style={styles.screenStyle}>
      <Text>Hub Messages</Text>
      <FlatList
        data={filteredMessages()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View
            style={{
              marginBottom: 10,
              alignItems: "flex-end",
              flexDirection: "row",
            }}
          >
            <Pressable
              onPress={() => setSelectedTab("all")}
              style={{
                backgroundColor:
                  selectedTab == "all" ? COLORS.mainGreen : COLORS.grey,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
                marginRight: 2,
              }}
            >
              <Text
                style={{
                  color: selectedTab == "all" ? COLORS.black : "white",
                  fontWeight: "700",
                }}
              >
                All
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setSelectedTab("read")}
              style={{
                backgroundColor:
                  selectedTab == "read" ? COLORS.mainGreen : COLORS.grey,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
                flexDirection: "row",
                alignItems: "center",
                marginRight: 2,
              }}
            >
              <Text
                style={{
                  color: selectedTab == "read" ? COLORS.black : "white",
                  fontWeight: "700",
                }}
              >
                Read
              </Text>
              <View
                onPress={() => setSelectedTab("read")}
                style={{
                  height: 18,
                  width: 18,
                  borderRadius: 9,
                  backgroundColor: COLORS.mainGreen,
                  marginLeft: 6,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: "700" }}>3</Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => setSelectedTab("unread")}
              style={{
                backgroundColor:
                  selectedTab == "unread" ? COLORS.mainGreen : COLORS.grey,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: selectedTab == "unread" ? COLORS.black : "white",
                  fontWeight: "700",
                }}
              >
                Unread
              </Text>
              <View
                style={{
                  height: 18,
                  width: 18,
                  borderRadius: 9,
                  backgroundColor: COLORS.mainGreen,
                  marginLeft: 6,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: "700" }}>+</Text>
              </View>
            </Pressable>
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
    paddingHorizontal: 10,
  },
  itemStyle: {
    width: windowWidth - 10,
    marginBottom: 2,
    backgroundColor: COLORS.grey,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // borderRadius: 8,
  },
});
