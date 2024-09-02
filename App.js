import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import NidScreen from "./screens/NidScreen";
import BirthScreen from "./screens/BirthScreen";
import PassportScreen from "./screens/PassportScreen";
import { StatusBar } from "react-native";
import BankScreen from "./screens/BankScreen";

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
            name="NidScreen"
            component={NidScreen}
            options={{ title: "NID Verification" }}
          />
          <Stack.Screen
            name="PassportScreen"
            component={PassportScreen}
            options={{ title: "Passport Verification" }}
          />

          <Stack.Screen
            name="BirthScreen"
            component={BirthScreen}
            options={{ title: "Birth Registration Verification" }}
          />
          <Stack.Screen
            name="BankScreen"
            component={BankScreen}
            options={{ title: "Bank Info Verification" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
