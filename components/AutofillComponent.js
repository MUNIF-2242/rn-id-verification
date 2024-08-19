// AutofillComponent.js
import React from "react";
import { View, Text } from "react-native";
import CustomLabel from "./CustomLabel"; // Adjust the path if necessary
import MarginTop from "./spacer/MarginTop";

const AutofillComponent = ({ name, dob, nid }) => {
  return (
    <View>
      <MarginTop />
      <MarginTop />
      <CustomLabel text="Name" />
      <Text>{name}</Text>
      <MarginTop />
      <CustomLabel text="Dob" />
      <Text>{dob}</Text>
      <MarginTop />
      <CustomLabel text="Nid" />
      <Text>{nid}</Text>
    </View>
  );
};

export default AutofillComponent;
