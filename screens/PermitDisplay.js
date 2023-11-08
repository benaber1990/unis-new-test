import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import COLORS from "../misc/COLORS";
import Checkbox from "expo-checkbox";

export default function PermitDisplay({ navigation }) {
  const [isChecked, setChecked] = useState(false);
  const [text, setText] = useState("");

  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();

  function ButtonAlert() {
    Alert.alert("Permit Submitted", "Your Permit Has Been Submitted!", [
      {
        text: "Return",
        // onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
    ]);
  }

  function handleSubmit() {
    console.log("Submitted");
    setChecked(false);
    setText("");
    ButtonAlert();
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <View style={styles.screenStyle}>
        {/* Permit Title */}
        <View>
          <Text
            style={{
              color: COLORS.mainGreen,
              fontSize: 18,
              fontWeight: "700",
              // marginBottom: 20,
            }}
          >
            Permit Title:
            <Text style={{ color: "white" }}> Permit Title Here</Text>
          </Text>
        </View>

        {/* View Full Pemit Link */}
        <View>
          <Pressable
            onPress={() =>
              navigation.navigate("PermitSingle", {
                title: "Permit Title",
                category: "Category",
                imgLink:
                  "https://images.pexels.com/photos/271667/pexels-photo-271667.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
              })
            }
            style={styles.buttonStyleChecked}
          >
            <Text style={{ fontSize: 16, fontWeight: "700" }}>
              View Full Permit
            </Text>
          </Pressable>
        </View>

        {/* Permit Image */}
        <Pressable
          onPress={() =>
            navigation.navigate("PermitSingle", {
              title: "Permit Title",
              category: "Category",
              imgLink:
                "https://images.pexels.com/photos/271667/pexels-photo-271667.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            })
          }
        >
          <Image
            source={{
              uri: "https://images.pexels.com/photos/271667/pexels-photo-271667.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            }}
            style={{
              width: 300,
              height: 200,
              borderRadius: 6,
              marginVertical: 20,
            }}
          />
        </Pressable>

        {/* --- Permit Acceptance --- */}
        <View style={styles.permitAcceptanceCard}>
          <View>
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "700",
                marginBottom: 20,
              }}
            >
              Permit Acceptance
            </Text>
          </View>

          {/* Sign Name Text Input */}
          <View>
            <TextInput
              style={styles.textInputStyle}
              placeholder="Type Your Full Name Here"
              placeholderTextColor="lightgrey"
              value={text}
              onChangeText={(t) => setText(t)}
            />
          </View>

          {/* Date */}
          <View style={{ marginTop: 30 }}>
            <Text
              style={{
                color: COLORS.lightGreen,
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              Signed Date: {dd}.{mm}.{yyyy}
            </Text>
          </View>

          {/* Time */}

          {/* Checkbox */}
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: 40,
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Checkbox
              style={{ marginRight: 10 }}
              value={isChecked}
              onValueChange={setChecked}
              color={isChecked ? COLORS.mainGreen : COLORS.lightGreen}
            />
            <Text
              style={{
                color: COLORS.lightGreen,
                fontWeight: "600",
              }}
            >
              I confirm I've received, read and understand the pemit above
            </Text>
          </View>

          {/* Submit Button */}
          <View>
            {!isChecked ? (
              <Pressable style={styles.buttonStyleUnchecked}>
                <Text style={{ fontSize: 16, fontWeight: "700" }}>
                  Save and Submit
                </Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={handleSubmit}
                style={styles.buttonStyleChecked}
              >
                <Text style={{ fontSize: 16, fontWeight: "700" }}>
                  Save and Submit
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        {/*  */}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
    backgroundColor: COLORS.black,
  },
  textInputStyle: {
    backgroundColor: COLORS.black,
    height: 60,
    width: 300,
    borderRadius: 8,
    color: "white",
    fontSize: 16,
    paddingLeft: 15,
    // fontWeight: "600",
  },
  buttonStyleUnchecked: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 4,
    backgroundColor: COLORS.lightGreen,
    marginTop: 15,
  },
  buttonStyleChecked: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 4,
    backgroundColor: COLORS.mainGreen,
    marginTop: 15,
  },
  permitAcceptanceCard: {
    backgroundColor: COLORS.grey,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
});
