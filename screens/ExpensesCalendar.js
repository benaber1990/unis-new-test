import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Calendar } from "react-native-calendars";
import COLORS from "../misc/COLORS";

export default function ExpensesCalendar({ navigation, route }) {
  const [selected, setSelected] = useState("");

  // Calendar
  const CalendarModal = ({ onPress }) => (
    <View>
      <Pressable onPress={onPress} style={styles.calendarModalStyle}>
        <Text>Calendar Modal</Text>
        <Calendar
          onDayPress={(day) => {
            setSelected(day.dateString);
            console.log("selected day", selected);
          }}
          markedDates={{
            [selected]: {
              selected: true,
              disableTouchEvent: true,
              selectedDotColor: COLORS.mainGreen,
            },
          }}
          theme={{
            selectedDayBackgroundColor: COLORS.mainGreen,
            todayTextColor: COLORS.mainGreen,
            arrowColor: COLORS.mainGreen,
          }}
        />
      </Pressable>
      {/* Buttons */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
          marginHorizontal: 20,
        }}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ExpensesDisplay", {
              selectedDate: "",
            })
          }
          style={{
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 4,
            backgroundColor: COLORS.mainGreen,
            width: 120,
            alignSelf: "center",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontWeight: "700",
            }}
          >
            View Date
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ExpensesDisplay", {
              selectedDate: "",
            })
          }
          style={{
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 4,
            backgroundColor: COLORS.mainGreen,
            width: 120,
            alignSelf: "center",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontWeight: "700",
            }}
          >
            View Month
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.screenStyle}>
      <Text>Expenses Calendar</Text>
      <CalendarModal />
    </View>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    backgroundColor: COLORS.black,
    alignItems: "center",
  },
  calendarModalStyle: {
    borderRadius: 12,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 10,
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 30,
    borderWidth: 3,
  },
});
