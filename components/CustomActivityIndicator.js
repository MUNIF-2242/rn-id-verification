// CustomActivityIndicator.js
import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

const CustomActivityIndicator = ({ size = "large", color = "#fff", style }) => {
  return (
    <ActivityIndicator
      size={size}
      color={color}
      style={[styles.loadingIndicator, style]}
    />
  );
};

const styles = StyleSheet.create({
  loadingIndicator: {
    position: "absolute",
    zIndex: 1,
  },
});

export default CustomActivityIndicator;
