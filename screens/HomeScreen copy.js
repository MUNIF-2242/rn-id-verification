import React from "react";
import { View, Button, StyleSheet } from "react-native";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title="NID verification"
          onPress={() => navigation.navigate("ScreenOne")}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Birth registration Verification"
          onPress={() => navigation.navigate("ScreenTwo")}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Passport Verification"
          onPress={() => navigation.navigate("ScreenThree")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  buttonContainer: {
    width: "80%",
  },
});

export default HomeScreen;
