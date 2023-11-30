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
import BusinessCard from "./screens/BusinessCard";
import CreateProfileA from "./screens/CreProfA";
import ExpensesTracker from "./screens/ExpensesTracker";
import ExpensesList from "./screens/ExpensesList";
import ExpensesDisplay from "./screens/ExpensesDisplay";
import HubAllContent from "./screens/HubAllContent";
import ExpensesAddNew from "./screens/ExpensesAddNew";
import ExpenseSingle from "./screens/ExpenseSingle";
import HubFriendChatScreen from "./screens/HubFriendChatScreen";
import HubFriendProfileScreen from "./screens/HubFriendProfileScreen";
import HubFriendListScreen from "./screens/HubFriendsListScreen";
import HubAIChatScreen from "./screens/HubAIChatScreen";
import FindFriendsScreen from "./screens/HubFindFriends";
import HubNonFriendUser from "./screens/HubNonFriendUser";
import HubFriendRequests from "./screens/HubFriendRequests";
import HubStartNewMessage from "./screens/HubStartNewMessage";
import HubMessages from "./screens/HubMessages";
import HubAddFriend from "./screens/HubAddFriend";
import HubStoriesDisplay from "./screens/HubStoriesDisplay";
import HubAddPost from "./screens/HubAddPost";
import HubSearch from "./screens/HubSearch";
import HubMyProfile from "./screens/HubMyProfile";
import HubAddStory from "./screens/HubAddStory";
import HubPostDisplay from "./screens/HubPostDisplay";
import Projects from "./screens/Projects";
import ProjectDisplay from "./screens/ProjectDisplay";
import ProjectItemDisplay from "./screens/ProjectItemDisplay";
import ProjectGallery from "./screens/ProjectGallery";
import BusinessCardLearn from "./screens/BusinessCardLearn";
import HubFriendAdd from "./screens/HubFriendAdd";
import HubMyPosts from "./screens/HubMyPosts";
import MyGallery from "./screens/MyGallery";
import ExpensesCalendar from "./screens/ExpensesCalendar";
import ExpAddFromGal from "./screens/ExpAddFromGal";
import HubRemoveFriend from "./screens/HubRemoveFriend";
import AddNewCardPhoto from "./screens/AddNewCardPhoto";

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
            name="HubMyProfile"
            component={HubMyProfile}
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
            name="ExpAddFromGal"
            component={ExpAddFromGal}
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
            name="ExpensesCalendar"
            component={ExpensesCalendar}
            options={{
              headerShown: true,
              title: "Expenses Calendar",
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
                backgroundColor: COLORS.mainGreen,
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
          <Stack.Screen
            name="TCScreen"
            component={TCScreen}
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
            name="MyGallery"
            component={MyGallery}
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
              title: "Your Cards",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="ExpensesAddNew"
            component={ExpensesAddNew}
            options={{
              headerShadowVisible: false,
              headerShown: true,
              title: "",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
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
            name="HubFriendAdd"
            component={HubFriendAdd}
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
            name="BusinessCard"
            component={BusinessCard}
            options={{
              headerShown: true,
              headerShadowVisible: false,
              title: "Your Pass Card",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="BusinessCardLearn"
            component={BusinessCardLearn}
            options={{
              headerShown: true,
              headerShadowVisible: false,
              title: "Your Contact Card",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="ProjectGallery"
            component={ProjectGallery}
            options={{
              headerShown: true,
              headerShadowVisible: false,
              title: "Project Gallery",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="HubFriendChat"
            component={HubFriendChatScreen}
            options={{
              headerShown: true,
              headerShadowVisible: false,
              title: "",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="HubFriendProfile"
            component={HubFriendProfileScreen}
            options={{
              headerShown: true,
              headerShadowVisible: false,
              title: "",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="HubAiChat"
            component={HubAIChatScreen}
            options={{
              headerShown: true,
              headerShadowVisible: false,
              title: "",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="HubMessages"
            component={HubMessages}
            options={{
              headerShown: true,
              headerShadowVisible: false,
              title: "Your Messages",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="HubFriendRequests"
            component={HubFriendRequests}
            options={{
              headerShown: true,
              headerShadowVisible: false,
              title: "Connection Requests",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="HubAddFriend"
            component={HubAddFriend}
            options={{
              headerShown: true,
              headerShadowVisible: false,
              title: "Add as Connection",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="HubStartNewMessage"
            component={HubStartNewMessage}
            options={{
              headerShown: true,
              headerShadowVisible: false,
              title: "Compose New Message",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="HubNonFriendUser"
            component={HubNonFriendUser}
            options={{
              headerShown: true,
              headerShadowVisible: false,
              title: "",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="FindFriends"
            component={FindFriendsScreen}
            options={{
              headerShown: true,
              headerShadowVisible: false,
              title: "Find Connections",
              headerStyle: {
                backgroundColor: COLORS.mainGreen,
              },
              headerTintColor: COLORS.black,
            }}
          />
          <Stack.Screen
            name="HubStoriesDisplay"
            component={HubStoriesDisplay}
            options={{
              headerShown: true,
              headerShadowVisible: false,
              headerTransparent: true,
              title: "",
              headerStyle: {
                // backgroundColor: COLORS.mainGreen,
              },
              headerTintColor: COLORS.black,
            }}
          />
          <Stack.Screen
            name="HubAddPost"
            component={HubAddPost}
            options={{
              headerShown: true,
              headerShadowVisible: false,
              title: "Add New Post",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="HubSearch"
            component={HubSearch}
            options={{
              headerShown: true,
              headerShadowVisible: false,
              title: "",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="HubPostDisplay"
            component={HubPostDisplay}
            options={{
              headerShown: true,
              headerShadowVisible: false,
              title: "",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="HubAddStory"
            component={HubAddStory}
            options={{
              headerShown: true,
              headerShadowVisible: false,
              title: "Add New Post",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="HubFriendsList"
            component={HubFriendListScreen}
            options={{
              headerShown: true,
              headerShadowVisible: false,
              title: "Your Connections",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="HubMyPosts"
            component={HubMyPosts}
            options={{
              headerShown: true,
              headerShadowVisible: false,
              title: "Your Posts",
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
            name="HubAllContent"
            component={HubAllContent}
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
          <Stack.Screen
            name="CreateProfileA"
            component={CreateProfileA}
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
            name="ExpensesTracker"
            component={ExpensesTracker}
            options={{
              headerShown: true,
              title: "Expenses Tracker",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="AddNewCardPhoto"
            component={AddNewCardPhoto}
            options={{
              headerShown: true,
              title: "Expenses Tracker",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="HubRemoveFriend"
            component={HubRemoveFriend}
            options={{
              headerShown: true,
              title: "Remove Connection",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="ProjectDisplay"
            component={ProjectDisplay}
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
            name="Projects"
            component={Projects}
            options={{
              headerShown: true,
              title: "Your Projects",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="ProjectItemDisplay"
            component={ProjectItemDisplay}
            options={{
              headerShown: true,
              title: "Your Projects",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="ExpensesList"
            component={ExpensesList}
            options={{
              headerShown: true,
              title: "Expenses Tracker",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="ExpensesDisplay"
            component={ExpensesDisplay}
            options={{
              headerShown: true,
              headerShadowVisible: false,
              title: "",
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerTintColor: COLORS.mainGreen,
            }}
          />
          <Stack.Screen
            name="ExpenseSingle"
            component={ExpenseSingle}
            options={{
              headerShown: true,
              headerShadowVisible: false,
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
