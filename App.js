import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import NidScreen from "./screens/NidScreen";
import BirthScreen from "./screens/BirthScreen";
import PassportScreen from "./screens/PassportScreen";
import { StatusBar } from "react-native";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar hidden={false} />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerTintColor: "white",
            headerStyle: {
              backgroundColor: "#2c3e50",
            },
            headerTitleAlign: "center",
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "ID Verification" }}
          />
          <Stack.Screen
            name="ScreenOne"
            component={NidScreen}
            options={{ title: "NID Verification" }}
          />
          <Stack.Screen
            name="ScreenTwo"
            component={PassportScreen}
            options={{ title: "Passport Verification" }}
          />

          <Stack.Screen
            name="ScreenThree"
            component={BirthScreen}
            options={{ title: "Birth Registration Verification" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
