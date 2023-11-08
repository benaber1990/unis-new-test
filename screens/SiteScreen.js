import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import ComingSoonIcon from "../miscComps/ComingSoonIcon";
import COLORS from "../misc/COLORS";
import TextCardComp from "../miscComps/TextCardComp";
import UnisFooter1 from "../miscComps/UnisFooter1";

export default function SiteScreen({ navigation }) {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.black, paddingBottom: 40 }}
    >
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
          Your <Text style={{ color: COLORS.mainGreen }}>UNIS Site </Text>Tools
        </Text>

        {/* Coming Soon Icons */}
        <View style={{ flexDirection: "row" }}>
          <ComingSoonIcon title="Plant" />
          <ComingSoonIcon title="Equipment" />
        </View>
        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <ComingSoonIcon title="Daily Logs" />
          <ComingSoonIcon title="Checksheets" />
        </View>
        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <ComingSoonIcon title="Gallery" />
          <ComingSoonIcon title="Reports" />
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    backgroundColor: COLORS.black,
    flex: 1,
    alignItems: "center",
  },
});
