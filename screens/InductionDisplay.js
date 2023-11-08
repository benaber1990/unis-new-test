import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Button, Pressable, Alert } from "react-native";
import COLORS from "../misc/COLORS";
import { Video, ResizeMode } from "expo-av";
import Checkbox from "expo-checkbox";

export default function InductionDisplay({ route }) {
  const { site, title, info } = route.params;
  const video = useRef(null);
  const [status, setStatus] = useState({});
  const [isChecked, setChecked] = useState(false);

  // Alert
  const createAlert = () =>
    Alert.alert(
      "Induction Completed!",
      `Congratulations, you've completed the ${title} induction`,
      [
        {
          text: "Okay",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ]
    );

  return (
    <View style={styles.screenStyle}>
      <Text style={{ color: "white" }}>{title}</Text>
      <Video
        ref={video}
        style={{
          width: 300,
          height: 200,
          resizeMode: "contain",
          marginTop: 40,
          marginBottom: 20,
        }}
        source={{
          uri: "https://secure-ds.serving-sys.com/resources/PROD/asset/2/VIDEO/20231020/UKEN_BANANASLUGS1_VIDEO_169AR_15s_MXIV_GLKPR_NA_WM_AMXD0214070H_NSPRE_1_83021391597674906.MP4",
        }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
      />
      <View style={styles.buttons}>
        <Button
          title={status.isPlaying ? "Pause" : "Play"}
          onPress={() =>
            status.isPlaying
              ? video.current.pauseAsync()
              : video.current.playAsync()
          }
        />
      </View>

      {/* Check */}
      <View style={{ flexDirection: "row", marginHorizontal: 30 }}>
        <Checkbox
          style={{ marginRight: 5 }}
          value={isChecked}
          onValueChange={setChecked}
          color={isChecked ? COLORS.mainGreen : COLORS.lightGreen}
        />
        <Text
          style={{ fontSize: 12, fontWeight: "300", color: COLORS.lightGreen }}
        >
          I have watched and understand the contents of this Inductions
        </Text>
      </View>

      {/* Submit */}
      <Pressable
        onPress={createAlert}
        style={{
          marginTop: 20,
          backgroundColor: COLORS.mainGreen,
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 6,
        }}
      >
        <Text style={{ fontWeight: "600" }}>Save & Submit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    backgroundColor: COLORS.black,
    alignItems: "center",
  },
  signCardStyle: {
    width: 300,
    backgroundColor: COLORS.lightGreen,
  },
});
