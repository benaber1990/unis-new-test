import React, { useState, useEffect, createContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Pressable,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import Animated, {
  FadeInLeft,
  RollInLeft,
  RollInRight,
  RollOutLeft,
} from "react-native-reanimated";

import { Ionicons } from "@expo/vector-icons";
import COLORS from "../misc/COLORS";

import { useNavigation } from "@react-navigation/native";

import firebase from "firebase/compat";

// import firebase from "firebase/compat/app";
import "firebase/compat/database";
import LogInErrMsg from "../miscComps/LogInErrMsg";
// import {
//   getAuth,
//   GoogleAuthProvider,
//   signInWithCredential,
// } from "firebase/auth";

// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes,
// } from "@react-native-google-signin/google-signin";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APPID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

//FIREBASE APP

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

const MyContext = createContext();

function InitLogIn({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [logErr, setLogErr] = useState(false);

  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        // Prevent default behavior of leaving the screen
        e.preventDefault();
      }),
    [navigation]
  );

  const navigationHndl = useNavigation();

  // const signIn = async () => {
  //   GoogleSignin.configure(
  //     Platform.OS === "android"
  //       ? {
  //           scopes: ["https://www.googleapis.com/auth/drive.readonly"], // what API you want to access on behalf of the user, default is email and profile
  //           webClientId:
  //             "500039576121-j46pleau65gc22mn0id3ieudrdumbc7a.apps.googleusercontent.com", // client ID of type WEB for your server (needed to verify user ID and offline access)
  //           offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  //           hostedDomain: "", // specifies a hosted domain restriction
  //           forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
  //           accountName: "",
  //           androidClientId:
  //             "500039576121-2ht2n7jk53d7cicusekhrludk1gipj9j.apps.googleusercontent.com", // [Android] specifies an account name on the device that should be used
  //           iosClientId: "<FROM DEVELOPER CONSOLE>", // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
  //           googleServicePlistPath: "", // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
  //           openIdRealm: "", // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
  //           profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
  //         }
  //       : {}
  //   );
  //   try {
  //     await GoogleSignin.hasPlayServices();
  //     const { idToken } = await GoogleSignin.signIn();
  //     // Create a Google credential with the token
  //     const googleCredential = GoogleAuthProvider.credential(idToken);
  //     // Sign-in the user with the credential
  //     return signInWithCredential(
  //       getAuth(firebase.initializeApp(firebaseConfig)),
  //       googleCredential
  //     )
  //       .then((res) => {
  //         navigationHndl.navigate("Home");
  //       })
  //       .catch((err) => {
  //         console.log("err", err);
  //       });
  //     // setState({ userInfo });
  //   } catch (error) {
  //     console.log("error", error);
  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //       // user cancelled the login flow
  //     } else if (error.code === statusCodes.IN_PROGRESS) {
  //       // operation (e.g. sign in) is in progress already
  //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //       // play services not available or outdated
  //     } else {
  //       // some other error happened
  //     }
  // }
  // };
  const handleLogin = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Login successful, user is signed in
        const user = userCredential.user;
        console.log("Login successful:", user.uid);
        console.log("this is email!", email);
        // firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        navigationHndl.navigate("Home", { userEmail: email });
      })
      .catch((error) => {
        // Handle login errors
        setLogErr((prevState) => !prevState);
        console.error("Login error:", error);
      });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <Pressable onPress={Keyboard.dismiss} style={styles.screenStyle}>
        {/* Logo */}
        <View style={{}}>
          <Image
            source={{
              uri: "https://i.imgur.com/vIhCAJH.png",
            }}
            style={{
              height: 100,
              width: 100,
              resizeMode: "contain",
              marginBottom: 10,
            }}
          />
        </View>
        {/* Logo Copy Subtitle */}
        <View>
          <Text
            style={{
              color: "white",
              fontSize: 22,
              fontWeight: "700",
              marginBottom: 25,
              marginTop: -10,
            }}
          >
            Fast
            <Text style={{ color: COLORS.mainGreen, fontSize: 28 }}>. </Text>
            Simple
            <Text style={{ color: COLORS.mainGreen, fontSize: 28 }}>. </Text>
            Secure
            <Text style={{ color: COLORS.mainGreen, fontSize: 28 }}>.</Text>
          </Text>
        </View>

        {/* Error Message */}
        {logErr && <LogInErrMsg />}

        {/* Email */}
        <View style={{ marginBottom: 20 }}>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(text) => setEmail(text)}
            placeholder="Email Address"
            placeholderTextColor={"lightgrey"}
            autoCapitalize="none"
          />
        </View>
        {/* Password */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput
            style={[
              styles.input,
              {
                width: 250,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              },
            ]}
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={showPassword ? false : true}
            placeholder="Password"
            placeholderTextColor={"lightgrey"}
          />
          <Pressable
            onPress={() => setShowPassword((prevState) => !prevState)}
            style={{
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: COLORS.grey,
              width: 50,
              height: 60,
              borderTopRightRadius: 30,
              borderBottomRightRadius: 30,
              paddingRight: 5,

              alignSelf: "center",
            }}
          >
            <Ionicons
              name={showPassword ? "ios-eye" : "ios-eye-off"}
              size={18}
              color="white"
            />
          </Pressable>
        </View>

        {/* Lost Password */}
        <Pressable
          onPress={() => navigation.navigate("PasswordReset")}
          style={{ paddingTop: 4 }}
        >
          <Text style={{ color: "lightgrey" }}>
            Forgot password?{" "}
            <Text style={{ textDecorationLine: "underline" }}>
              Click here to reset
            </Text>
          </Text>
        </Pressable>

        {/* Submit Button */}
        <TouchableOpacity
          // onPress={handleLogin}
          onPress={
            email.length > 3 && password.length > 6
              ? handleLogin
              : () => setLogErr(true)
          }
          style={[
            styles.button,
            {
              borderRadius: 30,
              paddingHorizontal: 30,
              backgroundColor:
                email.length > 3 && password.length > 6
                  ? COLORS.mainGreen
                  : COLORS.lightGreen,
            },
          ]}
        >
          <Text style={{ fontSize: 18, fontWeight: "600" }}>Submit</Text>
        </TouchableOpacity>

        {/* Google Sign In */}
        {/* <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={signIn}
          disabled={false}
        /> */}

        {/* Create Account Link */}

        <Pressable
          onPress={() => navigation.navigate("CreateAccount")}
          style={{ marginTop: 30, alignSelf: "center" }}
        >
          <Text style={{ color: "white", textAlign: "center", fontSize: 16 }}>
            New to{" "}
            <Text style={{ fontWeight: "700", color: COLORS.mainGreen }}>
              UNIS
            </Text>
            ?
          </Text>
          <Text
            style={{
              color: "lightgrey",
              textAlign: "center",
              textDecorationLine: "underline",
            }}
          >
            Click here to create your account
          </Text>
        </Pressable>

        {/* Footer */}
        <View>
          <Text style={{ color: "white", marginTop: 60 }}>
            Powered by{" "}
            <Text style={{ fontWeight: "700", color: "#ffd500" }}>
              UNIS Media
            </Text>
            . All rights reserved. 2023
          </Text>
        </View>
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
    height: 60,
    width: 300,
    paddingLeft: 20,
    backgroundColor: COLORS.grey,
    borderRadius: 30,
    fontSize: 16,
    color: "white",
  },
  button: {
    backgroundColor: COLORS.mainGreen,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    marginTop: 30,
    marginBottom: 15,
  },
});

export default InitLogIn;
