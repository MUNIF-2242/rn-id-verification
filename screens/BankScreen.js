import React, { useState } from "react";
import { View, Alert, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import CustomLabel from "../components/CustomLabel";
import CustomImage from "../components/CustomImage";
import PlaceholderImage from "../components/PlaceholderImage";
import CustomActivityIndicator from "../components/CustomActivityIndicator";
import MarginTop from "../components/spacer/MarginTop";
import CustomButton from "../components/CustomButton";
import { ScrollView } from "react-native";
import BankAutofillComponent from "../components/BankAutofillComponent";

const BankScreen = () => {
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const [chequeImage, setChequeImage] = useState(null);
  const [chequeUrl, setChequeUrl] = useState("");

  const [routingNumber, setRoutingNumber] = useState(null);
  const [bankName, setBankName] = useState(null);
  const [districtName, setDistrictName] = useState(null);
  const [branchName, setBranchName] = useState(null);
  const [accountNumber, setAccountNumber] = useState(null);

  const [chequeLoading, setChequeLoading] = useState(false);
  const [bankDetailsResponse, setBankDetailsResponse] = useState(false);

  const pickCheque = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission to access camera is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [2, 1],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setChequeImage(result.assets[0].uri);
      uploadCheque(result.assets[0].base64);
    }
  };

  const uploadCheque = async (base64Image) => {
    setChequeLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/upload-cheque`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64Image }),
      });

      const data = await response.json();
      if (data.imageUrl) {
        setChequeUrl(data.imageUrl);

        Alert.alert(
          "Bank cheque leaf uploaded successfully!",
          `Bank cheque leaf URL: ${data.imageUrl}`
        );
        await extractCheque();
      } else {
        Alert.alert(
          "Failed to upload Bank cheque leaf image",
          `Error: ${data.message}`
        );
      }
    } catch (error) {
      Alert.alert("An error occurred", error.message);
    } finally {
    }
  };

  //Function to detect texts
  const extractCheque = async () => {
    console.log("detect text call");
    try {
      const response = await fetch(`${BASE_URL}/extract-cheque`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileName: "bank.jpg" }),
      });
      const data = await response.json();
      if (data.status == "success") {
        console.log(`Detected Text: ${JSON.stringify(data)}`);
        Alert.alert(
          "Text detection successful!",
          `Detected Text: ${JSON.stringify(data)}`
        );
        setRoutingNumber(data.chequeExtractData.routingNumber);
        setAccountNumber(data.chequeExtractData.accountNumber);

        await bankDetails(data.chequeExtractData.routingNumber);
      } else {
        Alert.alert("Please provide valid Bank cheque leaf frontside image");
      }
    } catch (error) {
      Alert.alert("An error occurred", error.message);
    } finally {
    }
  };

  const bankDetails = async (routingNumber) => {
    console.log("bank details call");
    try {
      const response = await fetch(`${BASE_URL}/bank-details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ routingNumber }),
      });
      const data = await response.json();
      setBankName(data.bankDetails.bankName);
      setDistrictName(data.bankDetails.districtName);
      setBranchName(data.bankDetails.branchName);
      setBankDetailsResponse(data.status);
      if (data.status == "success") {
        console.log(`Detected Text: ${JSON.stringify(data)}`);
        Alert.alert(
          "Text detection successful!",
          `Detected Text: ${JSON.stringify(data)}`
        );
      } else {
        Alert.alert("Failed to provide bank details");
      }
    } catch (error) {
      Alert.alert("An error occurred", error.message);
    } finally {
      setChequeLoading(false);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <CustomLabel text="Bank cheque leaf" />
        <MarginTop />
        <View style={styles.widePlaceholderContainer}>
          {chequeLoading && <CustomActivityIndicator />}
          {chequeImage ? (
            <CustomImage source={{ uri: chequeImage }} />
          ) : (
            !chequeLoading && <PlaceholderImage />
          )}
        </View>

        <MarginTop />
        <CustomButton
          buttonStyle={{ width: "30%" }}
          onPress={pickCheque}
          text="Upload"
          showIcon={bankDetailsResponse === "success"}
        />
        <MarginTop />
        {bankDetailsResponse === "success" ? (
          <BankAutofillComponent
            bankName={bankName}
            districtName={districtName}
            branchName={branchName}
            accountNumber={accountNumber}
            routingNumber={routingNumber}
          />
        ) : null}
      </View>
    </ScrollView>
  );
};

export default BankScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profilePlaceholderContainer: {
    position: "relative",
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  widePlaceholderContainer: {
    position: "relative",
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  errorMessage: {
    color: "red",
  },
});
