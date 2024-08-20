// AutofillComponent.js
import React from "react";
import { View, Text } from "react-native";
import CustomLabel from "./CustomLabel"; // Adjust the path if necessary
import MarginTop from "./spacer/MarginTop";

const PassportAutofillComponent = ({
  passportNumber,
  birthDate,
  expirationDate,
  personalNumber,
}) => {
  return (
    <View>
      <MarginTop />
      <MarginTop />
      <CustomLabel text="Passport Number" />
      <Text>{passportNumber}</Text>
      <MarginTop />
      <CustomLabel text="Expiration Date" />
      <Text>{expirationDate}</Text>
      <MarginTop />
      <CustomLabel text="Birth Date" />
      <Text>{birthDate}</Text>
      <MarginTop />
      <CustomLabel text="Personal Number" />
      <Text>{personalNumber}</Text>
    </View>
  );
};

export default PassportAutofillComponent;
