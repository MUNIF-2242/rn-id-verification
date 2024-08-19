// CustomLabel.js
import React from "react";
import { Text, StyleSheet } from "react-native";

// Define the CustomLabel component
const CustomLabel = ({ text, extrastyle }) => {
  return <Text style={[styles.label, extrastyle]}>{text}</Text>;
};

// Define default styles for the label
const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
});

export default CustomLabel;
