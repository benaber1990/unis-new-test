import React from "react";
import { View, Text, StyleSheet, Linking, Pressable } from "react-native";
import COLORS from "../misc/COLORS";
import ContactItem from "../miscComps/ContactItem";
import UnisFooter1 from "../miscComps/UnisFooter1";
import { Ionicons } from "@expo/vector-icons";

export default function ContactScreen() {
  // Make Phone Call
  const makePhoneCall = (phoneNumber) => {
    const phoneNumberURL = `tel:${phoneNumber}`;

    Linking.openURL(phoneNumberURL).catch((error) =>
      console.error(`Failed to make the phone call: ${error}`)
    );
  };

  // Send Email
  const sendEmail = (emailAddress) => {
    const emailURL = `mailto:${emailAddress}`;

    Linking.openURL(emailURL).catch((error) =>
      console.error(`Failed to send the email: ${error}`)
    );
  };

  return (
    <View style={styles.screenStyle}>
      {/* Contact Title */}
      <View style={{ marginBottom: 10 }}>
        <Text style={{ color: "white", fontSize: 22, fontWeight: "700" }}>
          Contact <Text style={{ color: COLORS.mainGreen }}>UNIS</Text>
        </Text>
      </View>

      {/* Phone Numbers List */}
      <Text>Contact Screen</Text>
      <ContactItem title="General Enquiries" onPress={makePhoneCall} />
      <ContactItem title="Sales" onPress={makePhoneCall} />
      <ContactItem title="Help & Support" onPress={makePhoneCall} />
      <ContactItem title="Advertising" onPress={makePhoneCall} />

      {/* Email */}
      <Pressable
        onPress={sendEmail}
        style={{
          flexDirection: "row",
          marginTop: 20,
          alignItems: "center",
        }}
      >
        <Ionicons
          name="mail"
          size={28}
          color={COLORS.mainGreen}
          style={{ marginRight: 10 }}
        />
        <Text style={{ color: "white", fontSize: 18, fontWeight: "700" }}>
          enquiries@unis.one
        </Text>
      </Pressable>

      {/* Footer */}
      <View style={{ marginTop: 60 }}>
        <UnisFooter1 />
      </View>
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
