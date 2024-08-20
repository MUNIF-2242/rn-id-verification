import React from "react";
import { Image, StyleSheet, View } from "react-native";

const CustomImage = ({ source, style }) => {
  return <Image source={source} style={[styles.image, style]} />;
};

const styles = StyleSheet.create({
  container: { backgroundColor: "green" },
  image: {
    width: "100%",
    height: 200,
  },
});

export default CustomImage;
