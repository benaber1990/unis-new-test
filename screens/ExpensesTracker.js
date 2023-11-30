import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import COLORS from "../misc/COLORS";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function ExpensesTracker({ navigation }) {
  const [showComponent1, setShowComponent1] = useState(true);
  const [showComponent2, setShowComponent2] = useState(false);
  const [hasReceipts, setHasReceipts] = useState(false);

  const navigationHndl = useNavigation();

  useEffect(() => {
    // Set a timeout to hide Component 1 after 3 seconds
    const timeout = setTimeout(() => {
      setShowComponent1(false);
      setShowComponent2(true);
    }, 1700);

    // Clear the timeout if the component is unmounted before the timeout completes
    return () => clearTimeout(timeout);
  }, []);

  const TEMPhasReceiptsHandler = () => {
    setHasReceipts((p) => !p);
  };

  const viewReceiptsHandler = () => {
    navigationHndl.navigate("ExpensesDisplay", {
      selectedDate: "",
    });
    setHasReceipts((p) => !p);
  };

  return (
    <View style={styles.screenStyle}>
      {/* No Saved Receipts */}

      <View>
        <Pressable
          onPress={viewReceiptsHandler}
          style={{ alignItems: "center" }}
        >
          <View
            style={{
              paddingVertical: 20,
              paddingHorizontal: 30,
              borderRadius: 12,
              backgroundColor: COLORS.mainGreen,
              alignItems: "center",
            }}
          >
            <Ionicons
              name="md-receipt-outline"
              size={64}
              color={COLORS.black}
            />
            <Text
              style={{
                color: COLORS.black,
                textAlign: "center",
                fontWeight: "700",
                // marginTop: 10,
                fontSize: 16,
              }}
            >
              View Your Receipts
            </Text>
          </View>
        </Pressable>

        {/* Scan Receipts */}
        <TouchableOpacity
          onPress={() => navigation.navigate("ExpensesAddNew")}
          style={{
            // paddingHorizontal: 20,
            paddingVertical: 20,
            borderRadius: 12,
            // backgroundColor: COLORS.grey,
            alignItems: "center",
            marginTop: 40,
            borderWidth: 2,
            borderColor: "white",
          }}
        >
          <MaterialCommunityIcons
            name="scan-helper"
            size={74}
            color={COLORS.mainGreen}
          />
          <Text
            style={{
              color: "white",
              fontWeight: "700",
              textAlign: "center",
              marginTop: 15,
            }}
          >
            Scan New Receipt
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("ExpAddFromGal")}
          style={{
            marginTop: 20,
            borderRadius: 6,
            borderWidth: 2,
            borderColor: "white",
            paddingVertical: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "700" }}>
            Upload from Gallery
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    backgroundColor: COLORS.black,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 60,
  },
  buttonStyle: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: COLORS.mainGreen,
  },
});
