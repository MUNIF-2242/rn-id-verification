// CustomIcon.js
import React from "react";
import { StyleSheet } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

// Define the CustomIcon component
const CustomIcon = ({
  name = "check",
  size = 20,
  color = "#fff",
  extrastyle,
}) => {
  return (
    <FontAwesome
      name={name}
      size={size}
      color={color}
      style={[styles.icon, extrastyle]}
    />
  );
};

// Define default styles for the icon
const styles = StyleSheet.create({
  icon: {
    marginLeft: 8,
  },
});

export default CustomIcon;
