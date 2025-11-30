// App.js
import React from "react";
import { Text, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Auth + API
import { AuthProvider, useAuth } from "./src/AuthContext";

// Screens
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeScreen from "./src/screens/dashboard";      // your dashboard UI
import AddPetScreen from "./src/screens/addPet";
import PetProfile from "./src/screens/PetProfile";
import LabRecords from "./src/screens/labrecords";
import FileUploadScreen from "./src/screens/fileUpload";
import graph from "./src/screens/graph";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/* ---------- Stacks ---------- */

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={HomeScreen} />
      <Stack.Screen name="AddPet" component={AddPetScreen} />
      <Stack.Screen name="PetProfile" component={PetProfile} />
      <Stack.Screen name="graph" component={graph} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  const { logout } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#B9BF1D",
        tabBarInactiveTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "#0B4F6C",
          height: 80,
          paddingBottom: 10,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") iconName = "home-outline";
          else if (route.name === "AllFiles") iconName = "folder-outline";
          else if (route.name === "Upload") iconName = "cloud-upload-outline";
          else if (route.name === "Logout") iconName = "log-out-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="AllFiles" component={LabRecords} />
      <Tab.Screen name="Upload" component={FileUploadScreen} />
      <Tab.Screen
        name="Logout"
        component={() => <Text style={{ color: "#fff" }}>Logging out...</Text>}
        listeners={{
          tabPress: (e) => {
            e.preventDefault(); // stop navigating to a screen
            logout();
          },
        }}
      />
    </Tab.Navigator>
  );
}

/* ---------- Auth vs App Root ---------- */

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    // Simple loading state while we check refresh token
    return (
      <Text style={{ marginTop: 50, textAlign: "center" }}>Loading...</Text>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        // Logged in: show tabs
        <MainTabs />
      ) : (
        // Not logged in: show auth stack
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

/* ---------- App Root ---------- */

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
