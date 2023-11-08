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
        navigationHndl.navigate("CreateProfile");
      })
      .catch((error) => {
        // Handle registration errors
        console.error("Registration error:", error);
        setSubErr((prevState) => !prevState);
      });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <Pressable onPress={Keyboard.dismiss} style={styles.screenStyle}>
        {/* Logo */}
        <View style={{ marginBottom: 40 }}>
          <UnisLogo height={200} width={200} />
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
        </View>

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
            <Text style={{ color: "white" }}>
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
        <Pressable
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
        </Pressable>
      </Pressable>
    </KeyboardAvoidingView>
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
    paddingLeft: 15,
    backgroundColor: COLORS.grey,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
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
