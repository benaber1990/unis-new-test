import React from "react";
import { StatusBar } from "expo-status-bar";
import { Alert, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import COLORS from "./misc/COLORS";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./screens/HomeScreen";
import Hub from "./screens/Hub";
import QRScreen from "./screens/QRScreen";
import Profile from "./screens/Profile";
import UserScreen from "./screens/UserScreen";
import InitLogin from "./screens/InitLogin";
import "expo-dev-menu";
import HRScreen from "./screens/HRScreen";
import HealthSafetyScreen from "./screens/HealthSafetyScreen";
import DocsComingSoon from "./screens/DocsComingSoon";
import SiteScreen from "./screens/SiteScreen";
import NotificationsScreen from "./screens/NotificationsScreen";
import ContentDisplay from "./screens/ContentDisplay";
import AllCards from "./screens/AllCards";
import AddNewCard from "./screens/AddNewCard";
import AllDocuments from "./screens/AllDocuments";
import AddNewDocument from "./screens/AddNewDocument";
import DrawingsScreen from "./screens/DrawingsScreen";
import DrawingDisplay from "./screens/DrawingDisplay";
import HealthScreen from "./screens/HealthScreen";
import InductionsScreen from "./screens/InductionsScreen";
import PermitsScreen from "./screens/PermitsScreen";
import PermitDisplay from "./screens/PermitDisplay";
import PermitSingle from "./screens/PermitSingle";
import ContactScreen from "./screens/ContactScreen";
import UpdateProfile from "./screens/UpdateProfile";
import CreateBio from "./screens/CreateBio";
import CreateAccountScreen from "./screens/CreateAccountScreen";
import ConfirmLogOut from "./screens/ConfirmLogOut";
import CreateProfile from "./screens/CreateProfile";
import PasswordReset from "./screens/PasswordReset";
import TestUploadScreen from "./screens/TestUploadScreen";
import NotDisplayListing from "./screens/NotDisplayListing";
import CreateProfilePicture from "./screens/CreateProfilePicture";
import TestFetchImages from "./screens/TestFetchImages";
import TCScreen from "./screens/TCScreen";
import UpdateProfileImage from "./screens/UpdateProfileImage";
import InductionDisplay from "./screens/InductionDisplay";
import CardDisplay from "./screens/CardDisplay";
import DocumentDisplay from "./screens/DocumentDisplay";
import ComingSoonExtra from "./screens/ComingSoonExtra";
import ComingSoonFriends from "./screens/ComingSoonFriends";
import ComingSoonJobs from "./screens/ComingSoonJobs";
import ComingSoonTraining from "./screens/ComingSoonTraining";
import AdminPostScreen from "./screens/AdminPostScreen";
import ExampleAnimate from "./screens/ExampleAnimate";
import ScanQR from "./screens/ScanQR";
import ScanQrDisplay from "./screens/ScanQRDisplay";
import DeleteDocumentConfirm from "./screens/DeleteDocumentConfirm";
import DeleteCardConfirm from "./screens/DeleteCardConfirm";
import AddCardBack from "./screens/AddCardBackPic";
import InductionMoreInfo from "./screens/InductionMoreInfo";
import ExpiringInformation from "./screens/ExpiringInformation";
import { NotificationProvider } from "./context/NotificationsContext";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        gestureEnabled: false,
        headerShown: false,
        // tabBarShowLabel: false,
        tabBarActiveTintColor: COLORS.mainGreen,
        tabBarInactiveTintColor: COLORS.lightGreen,
        tabBarStyle: {
          paddingBottom: 6,
          paddingTop: 6,
          backgroundColor: COLORS.black,
          borderTopColor: COLORS.black,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          gestureEnabled: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={18} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Hub"
        component={Hub}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="globe-outline" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="QR"
        component={QRScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="qr-code-outline" size={19} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="User"
        component={UserScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={21} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <NotificationProvider>
        <Stack.Navigator
          screenOptions={{ headerShown: false, gestureEnabled: false }}
        >
          <Stack.Screen
            name="HomeScreen"
            component={MyTabs}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="InitLogin"
            component={InitLogin}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="HRScreen"
            component={HRScreen}
            options={{
              headerShown: true,
              title: "",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="DocsComingSoon"
            component={DocsComingSoon}
            options={{
              headerShown: true,
              title: "",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="SiteScreen"
            component={SiteScreen}
            options={{
              headerShown: true,
              title: "",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="Notifications"
            component={NotificationsScreen}
            options={{
              headerShown: true,
              title: "Notifications",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="ContentDisplay"
            component={ContentDisplay}
            options={{
              headerShown: true,
              title: "UNIS Content",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="AllCards"
            component={AllCards}
            options={{
              headerShown: true,
              title: "",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="AddNewCard"
            component={AddNewCard}
            options={{
              headerShown: true,
              title: "",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="AllDocuments"
            component={AllDocuments}
            options={{
              headerShown: true,
              title: "",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="AddNewDocument"
            component={AddNewDocument}
            options={{
              headerShown: true,
              title: "",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="DrawingsScreen"
            component={DrawingsScreen}
            options={{
              headerShown: true,
              title: "Your Drawings",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="DrawingDisplay"
            component={DrawingDisplay}
            options={{
              headerShown: true,
              title: "",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="ScanQr"
            component={ScanQR}
            options={{
              headerShown: true,
              title: "",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="QrDisplay"
            component={ScanQrDisplay}
            options={{
              headerShown: true,
              title: "",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="HealthScreen"
            component={HealthScreen}
            options={{
              headerShown: true,
              title: "",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="InductionsScreen"
            component={InductionsScreen}
            options={{
              headerShown: true,
              title: "My Inductions",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="PermitsScreen"
            component={PermitsScreen}
            options={{
              headerShown: true,
              title: "Your Permits",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="PermitDisplay"
            component={PermitDisplay}
            options={{
              headerShown: true,
              title: "",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="PermitSingle"
            component={PermitSingle}
            options={{
              headerShown: true,
              title: "",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="ComingSoonExtra"
            component={ComingSoonExtra}
            options={{
              headerShown: true,
              title: "",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="ComingSoonFriends"
            component={ComingSoonFriends}
            options={{
              headerShown: true,
              title: "",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="ComingSoonJobs"
            component={ComingSoonJobs}
            options={{
              headerShown: true,
              title: "",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="ComingSoonTraining"
            component={ComingSoonTraining}
            options={{
              headerShown: true,
              title: "",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="ContactScreen"
            component={ContactScreen}
            options={{
              headerShown: true,
              title: "",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="UpdateProfile"
            component={UpdateProfile}
            options={{
              headerShown: true,
              title: "",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="CreateBio"
            component={CreateBio}
            options={{
              headerShown: true,
              title: "",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen name="ConfirmLogOut" component={ConfirmLogOut} />
          <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
          <Stack.Screen name="CreateProfile" component={CreateProfile} />
          <Stack.Screen
            name="PasswordReset"
            component={PasswordReset}
            options={{
              headerShown: true,
              title: "Reset Your Password",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen name="TestUpload" component={TestUploadScreen} />
          <Stack.Screen
            name="NotDisplay"
            component={NotDisplayListing}
            options={{
              headerShown: true,
              title: "",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen name="TestFetchImages" component={TestFetchImages} />
          <Stack.Screen
            name="InductionDisplay"
            component={InductionDisplay}
            options={{
              headerShown: true,
              title: "",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen name="TCScreen" component={TCScreen} />
          <Stack.Screen
            options={{
              headerShown: true,
              title: "Update Your Profile Image",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
            name="UpdateProfileImage"
            component={UpdateProfileImage}
          />
          <Stack.Screen
            name="CreateProfilePicture"
            component={CreateProfilePicture}
          />
          <Stack.Screen name="AddCardBack" component={AddCardBack} />
          <Stack.Screen
            name="DeleteDocumentConfirm"
            component={DeleteDocumentConfirm}
            options={{
              headerShadowVisible: false,
              headerShown: true,
              title: "Delete Document",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: "tomato",
            }}
          />
          <Stack.Screen
            name="DeleteCardConfirm"
            component={DeleteCardConfirm}
            options={{
              headerShadowVisible: false,
              headerShown: true,
              title: "Delete Card",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: "tomato",
            }}
          />
          <Stack.Screen
            name="CardDisplay"
            component={CardDisplay}
            options={{
              headerShadowVisible: false,
              headerShown: true,
              title: "YOUR CARDS",
              headerStyle: {
                backgroundColor: COLORS.mainGreen,
              },
              headerTintColor: COLORS.black,
            }}
          />
          <Stack.Screen
            name="DocumentDisplay"
            component={DocumentDisplay}
            options={{
              headerShown: true,
              title: "",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="HealthSafetyScreen"
            component={HealthSafetyScreen}
            options={{
              headerShown: true,
              title: "",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="AdminPostScreen"
            component={AdminPostScreen}
            options={{
              headerShown: true,
              title: "",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="InductionMoreInfo"
            component={InductionMoreInfo}
            options={{
              headerShown: true,
              title: "",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="ExpiringInformation"
            component={ExpiringInformation}
            options={{
              headerShown: true,
              title: "Notifications",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="ExampleAnimate"
            component={ExampleAnimate}
            options={{
              headerShown: true,
              title: "",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
        </Stack.Navigator>
      </NotificationProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
