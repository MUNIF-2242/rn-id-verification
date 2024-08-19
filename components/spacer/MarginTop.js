import React from "react";
import { View, StyleSheet } from "react-native";

const MarginTop = ({ extraStyle }) => {
  return <View style={[styles.spacer, extraStyle]} />;
};

const styles = StyleSheet.create({
  spacer: {
    marginTop: 10,
  },
});

export default MarginTop;
