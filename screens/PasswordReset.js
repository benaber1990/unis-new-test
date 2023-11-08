import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
} from "react-native";

import { uploadImage } from "./helpers/helpers";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Import Firebase
import firebase from "firebase/compat";
import "firebase/compat/database";
import "firebase/auth";
import COLORS from "../misc/COLORS";

//FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyChtonwBnG-Jzs-gMJRbTChiv-mwt13rNY",
  authDomain: "unis-1.firebaseapp.com",
  projectId: "unis-1",
  storageBucket: "unis-1.appspot.com",
  messagingSenderId: "500039576121",
  appId: "1:500039576121:web:af595bd3bc72422d4fbbe8",
  measurementId: "G-HY5WS3ZXYD",
};

//FIREBASE APP

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default function PasswordReset({ navigation }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(false);

  const handleResetPassword = () => {
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        setMessage(
          "Password reset email sent. Check your inbox for instructions."
        );
        setEmail("");
      })
      .catch((error) => {
        setMessage("Invalid Email");
      });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <View style={styles.screenStyle}>
        {/* Email Text Inpit */}
        <View>
          <Text
            style={{
              color: "white",
              marginBottom: 15,
            }}
          >
            Enter Your Email to Reset Your Password
          </Text>

          <TextInput
            value={email}
            onChangeText={(t) => setEmail(t)}
            placeholder="Enter Your Email Address"
            placeholderTextColor={"lightgrey"}
            style={styles.textInputStyle}
            autoCapitalize="none"
          />
        </View>

        {/* Submit Button */}
        <View>
          <Pressable
            onPress={handleResetPassword}
            style={[
              styles.buttonStyle,
              {
                backgroundColor:
                  email.length > 3 && email.includes("@")
                    ? COLORS.mainGreen
                    : COLORS.lightGreen,
              },
            ]}
          >
            <Text style={{ fontWeight: "700" }}>Reset Password</Text>
          </Pressable>

          {/* Reset Password Sent Message */}

          {message ? (
            <Pressable style={{ padding: 20 }}>
              <Text
                style={{
                  textAlign: "center",
                  color: COLORS.lightGreen,
                  fontWeight: "700",
                }}
              >
                {message}
              </Text>

              <Pressable
                onPress={() => navigation.navigate("HomeScreen")}
                style={{
                  maginTop: 40,
                  paddingHorizontal: 20,
                  paddingVertical: 15,
                  borderRadius: 6,
                  backgroundColor: COLORS.mainGreen,
                  alignSelf: "center",
                  marginTop: 40,
                }}
              >
                <Text style={{ fontWeight: "700" }}>
                  Return to Log In Screen
                </Text>
              </Pressable>
            </Pressable>
          ) : null}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    paddingTop: 100,
    alignItems: "center",
    backgroundColor: COLORS.black,
  },
  textInputStyle: {
    color: "white",
    fontSize: 16,
    fontWeight: "300",
    backgroundColor: COLORS.grey,
    height: 60,
    width: 260,
    paddingLeft: 15,
    marginBottom: 20,
  },
  buttonStyle: {
    backgroundColor: COLORS.mainGreen,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
    alignSelf: "center",
  },
});
