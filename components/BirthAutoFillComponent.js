// AutofillComponent.js
import React from "react";
import { View, Text } from "react-native";
import CustomLabel from "./CustomLabel"; // Adjust the path if necessary
import MarginTop from "./spacer/MarginTop";

const BirthAutoFillComponent = ({ name, dob, birthRegNo }) => {
  return (
    <View>
      <MarginTop />
      <MarginTop />
      <CustomLabel text="Name" />
      <Text>{name}</Text>
      <MarginTop />
      <CustomLabel text="Birth Registartion No" />
      <Text>{birthRegNo}</Text>
      <MarginTop />
      <CustomLabel text="Dob" />
      <Text>{dob}</Text>
    </View>
  );
};

export default BirthAutoFillComponent;
