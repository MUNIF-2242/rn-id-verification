// CustomButton.js
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import CustomIcon from "./CustomIcon"; // Adjust the path if necessary

const CustomButton = ({
  onPress,
  disabled = false,
  text,
  showIcon = false,
  buttonStyle,
  textStyle,
  iconStyle,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, textStyle]}>{text}</Text>
      {showIcon && <CustomIcon style={iconStyle} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "40%",
    flexDirection: "row",
    backgroundColor: "#8e44ad",
    padding: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default CustomButton;
