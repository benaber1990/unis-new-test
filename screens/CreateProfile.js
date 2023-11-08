import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import firebase from "firebase/compat";
import { useNavigation } from "@react-navigation/native";

// import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/auth";
import COLORS from "../misc/COLORS";
import LogInErrMsg from "../miscComps/LogInErrMsg";

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

function CreateProfile({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [postcode, setPostcode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dob, setDob] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [position, setPosition] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [DOBDay, setDOBDay] = useState("");
  const [DOBMonth, setDOBMonth] = useState("");
  const [DOBYear, setDOBYear] = useState("");

  const navigationHndl = useNavigation();

  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [dispErr, setDispErr] = useState(false);

  //   Add Data to Firestore
  const addDataToFirestore = async () => {
    try {
      const collectionRef = firebase
        .firestore()
        .collection("users")
        .doc(user.uid);
      await collectionRef.set({
        firstName: firstName,
        surname: surname,
        gender: gender,
        location: location,
        postcode: postcode,
        phoneNumber: phoneNumber,
        DOB: dob,
        jobTitle: jobTitle,
        positionRole: position,
        employmentType: employmentType,
        userId: user.uid,
        bio: "Your Bio Can Go Here",
        // Add more fields as needed
      });
      console.log("Data added to Firestore");
      console.log(location);
      navigationHndl.navigate("CreateProfilePicture");
    } catch (error) {
      console.error("Error adding data to Firestore:", error);
      setDispErr(true);
    }
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
      console.log(user);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.screenStyle}>
          <View style={{ marginBottom: 20, paddingTop: 40 }}>
            <Text style={{ color: "white", fontSize: 18, fontWeight: "500" }}>
              Create Profile
            </Text>
          </View>

          {/* {data.map((item) => (
        <Text key={item.id}>
          {item.field1} - {item.field2}
        </Text>
        // Render other fields as needed
      ))} */}

          {/* Create Profile */}
          <View>
            {/* First Name */}
            <View>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={(text) => setFirstName(text)}
              />
            </View>

            {/* Surname */}
            <View>
              <Text style={styles.label}>Surname</Text>
              <TextInput
                style={styles.input}
                value={surname}
                onChangeText={(text) => setSurname(text)}
              />
            </View>

            <View>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={(text) => setLocation(text)}
              />
            </View>
            <View>
              <Text style={styles.label}>Postcode</Text>
              <TextInput
                style={styles.input}
                value={postcode}
                onChangeText={(text) => setPostcode(text)}
              />
            </View>
            <View>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={(text) => setPhoneNumber(text)}
              />
            </View>
            {/* <View>
          <Text style={styles.label}>Date of Birth</Text>
          <TextInput
            style={styles.input}
            value={dob}
            onChangeText={(text) => setDob(text)}
          />
        </View> */}

            {/* Date of Birth */}
            <View style={{ flexDirection: "row" }}>
              <View style={{ marginRight: 20 }}>
                <Text style={styles.label}>DOB DD</Text>
                <TextInput
                  style={[styles.input, { width: "100%" }]}
                  value={DOBDay}
                  onChangeText={(text) => setDOBDay(text)}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
              <View style={{ marginRight: 20 }}>
                <Text style={styles.label}>DOB MM</Text>
                <TextInput
                  style={[styles.input, { width: "100%" }]}
                  value={DOBMonth}
                  onChangeText={(text) => setDOBMonth(text)}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
              <View style={{}}>
                <Text style={styles.label}>DOB YYYY</Text>
                <TextInput
                  style={[styles.input, { width: "100%" }]}
                  value={DOBYear}
                  onChangeText={(text) => setDOBYear(text)}
                  keyboardType="numeric"
                  maxLength={4}
                />
              </View>
            </View>

            {/* Gender */}
            <View>
              <Text style={styles.label}>Gender</Text>
              <TextInput
                style={styles.input}
                value={gender}
                onChangeText={(text) => setGender(text)}
              />
            </View>

            {/* Job Title */}
            <View>
              <Text style={styles.label}>Job Title</Text>
              <TextInput
                style={styles.input}
                value={jobTitle}
                onChangeText={(text) => setJobTitle(text)}
              />
            </View>
            <View>
              <Text style={styles.label}>Position/Role</Text>
              <TextInput
                style={styles.input}
                value={position}
                onChangeText={(text) => setPosition(text)}
              />
            </View>
            <View>
              <Text style={styles.label}>Employment Type</Text>
              <TextInput
                style={styles.input}
                value={employmentType}
                onChangeText={(text) => setEmploymentType(text)}
              />
            </View>
            {/* {user && (
            <View>
              <Text>{user.uid}</Text>
              <Text>Yes</Text>
            </View>
          )} */}
          </View>

          {/* Log In Error Message */}
          {dispErr && (
            <View style={{ marginBottom: 4 }}>
              <Text
                style={{
                  fontSize: 12,
                  color: "tomato",
                  marginBottom: 4,
                  textAlign: "center",
                }}
              >
                Invalid Create Profile Attempt. Please ensure all fields are
                completed
              </Text>
            </View>
          )}

          {/* Submit Button */}
          <Pressable
            onPress={
              firstName.length > 2 &&
              surname.length > 2 &&
              location.length > 2 &&
              postcode.length > 2 &&
              phoneNumber.length > 2 &&
              gender.length > 2 &&
              jobTitle.length > 2 &&
              position.length > 2 &&
              employmentType.length > 2
                ? addDataToFirestore
                : () => setDispErr(true)
            }
            style={{
              padding: 20,
              backgroundColor:
                firstName.length > 2 &&
                surname.length > 2 &&
                location.length > 2 &&
                postcode.length > 2 &&
                phoneNumber.length > 2 &&
                gender.length > 2 &&
                jobTitle.length > 2 &&
                position.length > 2 &&
                employmentType.length > 2
                  ? COLORS.mainGreen
                  : COLORS.lightGreen,
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 4,
              marginBottom: 40,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "600" }}>
              Save & Submit
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.black,
  },
  label: {
    color: "white",
    fontWeight: "500",
  },
  input: {
    height: 50,
    width: 300,
    paddingLeft: 15,
    marginTop: 4,
    marginBottom: 20,
    backgroundColor: COLORS.grey,
    fontSize: 16,
    color: "white",
  },
  button: {
    backgroundColor: COLORS.mainGreen,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 4,
  },
});

export default CreateProfile;
