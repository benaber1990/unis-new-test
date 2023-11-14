import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ComingSoonIcon from "../miscComps/ComingSoonIcon";
import COLORS from "../misc/COLORS";
import TextCardComp from "../miscComps/TextCardComp";
import UnisFooter1 from "../miscComps/UnisFooter1";

export default function AdminPostScreen({ navigation }) {
  return (
    <View style={styles.screenStyle}>
      {/* Title */}
      <Text
        style={{
          fontSize: 16,
          color: "white",
          fontWeight: "600",
          marginBottom: 60,
        }}
      >
        <Text style={{ color: COLORS.mainGreen }}>
          Posting & Socials! - Coming Soon
        </Text>
      </Text>

      {/* Coming Soon Icons */}
      <View style={{ flexDirection: "row" }}>
        <ComingSoonIcon title="Posts & Socials" />
      </View>

      <View style={{ height: 70 }} />
      {/* Text Card */}
      <TextCardComp
        backCol={COLORS.lightGreen}
        title={"Unlock more UNIS"}
        body={
          "Professional UNIS packages designed to take your construction business further"
        }
        link={() => navigation.navigate("ContactScreen")}
        buttonText={"Find Out More"}
        // titleColor={"white"}
        // bodyColor={"white"}
      />

      {/* Footer */}
      <View style={{ marginTop: 60 }}>
        <UnisFooter1 />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    backgroundColor: COLORS.black,
    flex: 1,
    alignItems: "center",
    paddingTop: 0,
  },
});
