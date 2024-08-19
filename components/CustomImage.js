import React from "react";
import { Image, StyleSheet, View } from "react-native";

const CustomImage = ({ source, style }) => {
  return (
    <View style={styles.container}>
      <Image source={source} style={[styles.image, style]} resizeMode="cover" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  image: {
    width: 100,
    height: 100,
  },
});

export default CustomImage;
