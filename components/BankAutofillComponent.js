// AutofillComponent.js
import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import CustomLabel from "./CustomLabel"; // Adjust the path if necessary
import MarginTop from "./spacer/MarginTop";

const BankAutofillComponent = ({
  bankName,
  districtName,
  branchName,
  accountNumber,
  routingNumber,
}) => {
  return (
    <View>
      <MarginTop />
      <MarginTop />
      <CustomLabel text="Account holder name" />
      <MarginTop />
      <TextInput
        style={styles.input}
        placeholder={"Enter your name"}
        placeholderTextColor="#888" // Customize placeholder color
        // value={value}
        //onChangeText={onChangeText}
      />
      <MarginTop />

      <CustomLabel text="Bank name" />
      <Text>{bankName}</Text>
      <MarginTop />
      <CustomLabel text="District name" />
      <Text>{districtName}</Text>
      <MarginTop />
      <CustomLabel text="Branch name" />
      <Text>{branchName}</Text>
      <MarginTop />
      <CustomLabel text="Account number" />
      <Text>{accountNumber}</Text>
      <MarginTop />
      <CustomLabel text="Routing number" />
      <Text>{routingNumber}</Text>
    </View>
  );
};

export default BankAutofillComponent;

const styles = StyleSheet.create({
  input: {
    fontSize: 16,
    color: "#333", // Text color
    borderWidth: 1,
    borderColor: "#b7b7b7",
    height: 50,
    borderRadius: 5,
    paddingLeft: 10,
  },
});
