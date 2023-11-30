import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import COLORS from "../misc/COLORS";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Checkbox from "expo-checkbox";
import UnisLogo from "../components/UnisLogo";
import LogInErrMsg from "../miscComps/LogInErrMsg";

// import firebase from "firebase/compat/app";
import firebase from "firebase/compat";
import "firebase/compat/database";
import "firebase/auth";

//FIREBASE CONFIG
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APPID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

//FIREBASE APPi

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

function CreateAccountScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setChecked] = useState(false);
  const [subErr, setSubErr] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigationHndl = useNavigation();

  const handleRegistration = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Registration successful, user is signed in
        const user = userCredential.user;
        // alert("k");
        console.log("Registration successful:", user);
        navigationHndl.navigate("CreateProfileA");
      })
      .catch((error) => {
        // Handle registration errors
        console.error("Registration error:", error);
        setSubErr((prevState) => !prevState);
      });
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: COLORS.black,
        paddingBottom: 80,
        paddingTop: 30,
      }}
    >
      <Pressable onPress={Keyboard.dismiss} style={styles.screenStyle}>
        {/* Logo */}
        <View style={{ marginBottom: 20 }}>
          <UnisLogo height={120} width={120} />
        </View>

        <View style={{ marginBottom: 30 }}>
          <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
            Create Your New{" "}
            <Text style={{ color: COLORS.mainGreen, fontWeight: "700" }}>
              UNIS{" "}
            </Text>
            Account
          </Text>
        </View>

        {/* Error Message */}
        {subErr && (
          <View>
            <LogInErrMsg />
          </View>
        )}

        {/* Email */}
        <KeyboardAvoidingView
          // behavior="padding"
          style={{
            flex: 1,
            alignItems: "center",
            backgroundColor: COLORS.black,
          }}
        >
          <View style={{ marginBottom: 15 }}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Your Email Address"
              placeholderTextColor={"lightgrey"}
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <View style={{ flexDirection: "row", marginBottom: 5 }}>
            <TextInput
              style={[styles.input, { width: 300 }]}
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry
              placeholder="Password. Min 8 Characters"
              placeholderTextColor={"lightgrey"}
            />
          </View>
        </KeyboardAvoidingView>

        {/* <Pressable
            onPress={() => setShowPassword((prevState) => !prevState)}
            style={{
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: COLORS.grey,
              width: 30,
              height: 70,
              borderTopRightRadius: 4,
              borderBottomRightRadius: 4,
              paddingRight: 5,

              alignSelf: "center",
            }}
          >
            <Ionicons
              name={showPassword ? "ios-eye" : "ios-eye-off"}
              size={18}
              color="white"
            />
          </Pressable> */}
        {/* GDPR Checkbox */}
        <View
          style={{
            marginHorizontal: 40,
            marginTop: 5,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Checkbox
            style={{ marginRight: 5 }}
            value={isChecked}
            onValueChange={setChecked}
            color={isChecked ? COLORS.mainGreen : COLORS.lightGreen}
          />
          <Pressable onPress={() => navigation.navigate("TCScreen")}>
            <Text style={{ color: "white", fontSize: 12 }}>
              By signing up to use UNIS, I accept the T&C's as{" "}
              <Text
                style={{
                  textDecorationLine: "underline",
                }}
              >
                outlined here
              </Text>
            </Text>
          </Pressable>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={
            email.length > 3 && password.length > 6 && isChecked
              ? handleRegistration
              : () => setSubErr(true)
          }
          style={[
            styles.button,
            {
              backgroundColor:
                (email.length > 3) & (password.length > 6) && isChecked
                  ? COLORS.mainGreen
                  : COLORS.lightGreen,
            },
          ]}
        >
          <Text style={{ fontSize: 18, fontWeight: "600" }}>Submit</Text>
        </TouchableOpacity>
      </Pressable>

      {/* Log in */}
      <Pressable onPress={() => navigation.navigate("InitLogin")}>
        <Text style={{ color: "white", textAlign: "center", marginTop: 30 }}>
          Already have an account?{" "}
          <Text style={{ textDecorationLine: "underline" }}>
            Click here to log in
          </Text>
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: COLORS.black,
  },
  label: {
    marginBottom: 5,
    color: "lightgrey",
    textAlign: "left",
    alignSelf: "flex-start",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 5,
  },
  input: {
    height: 70,
    width: 300,
    paddingLeft: 25,
    backgroundColor: COLORS.grey,
    borderRadius: 35,
    fontSize: 16,
    color: "white",
  },
  button: {
    backgroundColor: COLORS.mainGreen,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    marginTop: 30,
  },
});

export default CreateAccountScreen;
