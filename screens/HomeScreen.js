import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("NidScreen")}
      >
        <Text style={styles.buttonText}>NID Verification</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("PassportScreen")}
      >
        <Text style={styles.buttonText}>Passport Verification</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("BirthScreen")}
      >
        <Text style={styles.buttonText}>Birth Registration Verification</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("BankScreen")}
      >
        <Text style={styles.buttonText}>Bank Info Verification</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    width: "100%",
    marginBottom: 140,
    position: "absolute",
    top: 40,
  },
  titleText: {
    backgroundColor: "#2c3e50",
    padding: 30,
    textAlign: "center",
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  button: {
    width: "80%",
    paddingVertical: 25,
    marginVertical: 10,
    backgroundColor: "#8e44ad",
    borderRadius: 3,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textTransform: "none",
  },
});
