import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Pressable } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import COLORS from "../misc/COLORS";

export default function ScanQR({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [userData, setUserData] = useState("");

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setUserData(data);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <View>
          <Pressable
            onPress={() => setScanned(false)}
            style={{
              backgroundColor: COLORS.lightGreen,
              paddingVertical: 15,
              paddingHorizontal: 30,
              alignSelf: "center",
              borderRadius: 6,
            }}
          >
            <Text>Tap to Scan Again</Text>
          </Pressable>
          <Pressable
            onPress={() =>
              navigation.navigate("QrDisplay", {
                userData: userData,
              })
            }
            style={{
              backgroundColor: COLORS.mainGreen,
              paddingVertical: 15,
              paddingHorizontal: 30,
              alignSelf: "center",
              borderRadius: 6,
              marginTop: 30,
            }}
          >
            <Text style={{ fontWeight: "700" }}>
              Visit their UNIS Profile Page
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: COLORS.black,
  },
});
