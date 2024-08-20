// PlaceholderImage.js
import React from "react";
import { View, StyleSheet } from "react-native";

// Define the PlaceholderImage component
const PlaceholderImage = ({ extrastyle }) => {
  return <View style={[styles.placeholder, extrastyle]} />;
};

const styles = StyleSheet.create({
  placeholder: {
    width: "100%",
    height: 200,
    backgroundColor: "gray",
    opacity: 0.1,
  },
});

export default PlaceholderImage;
