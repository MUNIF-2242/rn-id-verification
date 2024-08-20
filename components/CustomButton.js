// CustomButton.js
import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import CustomIcon from "./CustomIcon"; // Adjust the path if necessary
import CustomActivityIndicator from "./CustomActivityIndicator";

const CustomButton = ({
  onPress,
  disabled = false,
  text,
  showIcon = false,
  buttonStyle,
  textStyle,
  iconStyle,
  loading = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, textStyle]}>{text}</Text>
      {showIcon && <CustomIcon style={iconStyle} />}
      {loading && (
        <View
          style={{ display: "flex", justifyContent: "center", marginLeft: 10 }}
        >
          <CustomActivityIndicator />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "40%",
    flexDirection: "row",
    backgroundColor: "#8e44ad",
    padding: 10,
    borderRadius: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default CustomButton;
