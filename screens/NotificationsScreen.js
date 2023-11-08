import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import COLORS from "../misc/COLORS";
import NOTIFICATIONS_DATA from "../misc/NOTIFICATIONS_DATA";
import { Ionicons, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";

function NotificationsScreen({ navigation }) {
  const Item = ({ alertTitle, alertCat }) => (
    <View style={styles.itemStyle}>
      <View
        style={{
          width: 20,
          backgroundColor: COLORS.mainGreen,
          borderTopLeftRadius: 4,
          borderBottomLeftRadius: 4,
          height: "100%",
        }}
      />
      <View
        style={{
          flexDirection: "row",
          paddingVertical: 10,
        }}
      >
        <Pressable>
          <View style={{}} />
          <View
            style={{
              flexDirection: "row",

              paddingRight: 10,
            }}
          >
            <Pressable
              onPress={() =>
                navigation.navigate("NotDisplay", { alertTitle, alertCat })
              }
              style={{ marginLeft: 20 }}
            >
              <Text style={{ fontSize: 16, fontWeight: "500" }}>
                {alertTitle}
              </Text>
              <Text style={{}}>Notification information can go here</Text>
            </Pressable>
            {/* <Pressable
          onPress={() =>
            navigation.navigate("NotDisplay", { alertTitle, alertCat })
          }
          style={{ marginLeft: 15 }}
        >
          <Ionicons name="chevron-forward-circle" size={24} color="black" />
        </Pressable> */}
          </View>
        </Pressable>
      </View>
      <View
        style={{
          marginLeft: 15,
          backgroundColor: COLORS.black,
          height: "100%",
        }}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "500",
            fontSize: 12,
            marginLeft: 10,
            marginTop: 10,
          }}
        >
          3 Hours
        </Text>
      </View>
    </View>
  );

  const renderItem = ({ item }) => (
    <Item alertTitle={item.alertTitle} alertCat={item.alertCat} />
  );

  return (
    <SafeAreaView style={styles.screenStyle}>
      <StatusBar style="dark" />
      <FlatList
        data={NOTIFICATIONS_DATA}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => <View style={{}}></View>}
        ListFooterComponent={() => (
          <View>
            <Pressable
              style={{
                paddingVertical: 10,
                paddingHorizontal: 10,
                borderRadius: 6,
                alignSelf: "center",
                backgroundColor: COLORS.lightGreen,
                flexDirection: "row",
                alignItems: "center",
                marginTop: 20,
                marginBottom: 60,
              }}
            >
              <MaterialCommunityIcons
                name="eraser-variant"
                size={24}
                color="black"
                style={{ marginRight: 5 }}
              />
              <Text style={{ fontWeight: "700" }}>Clear All Notifications</Text>
            </Pressable>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    backgroundColor: COLORS.black,
    flex: 1,
    alignItems: "center",
  },
  itemStyle: {
    backgroundColor: COLORS.lightGreen,
    marginBottom: 20,
    // paddingVertical: 15,
    // paddingHorizontal: 20,
    borderRadius: 4,
    flexDirection: "row",
  },
});

export default NotificationsScreen;
