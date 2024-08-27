import React, { useState } from "react";
import { View, Alert, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import CustomLabel from "../components/CustomLabel";
import CustomImage from "../components/CustomImage";
import PlaceholderImage from "../components/PlaceholderImage";
import CustomActivityIndicator from "../components/CustomActivityIndicator";
import MarginTop from "../components/spacer/MarginTop";
import CustomButton from "../components/CustomButton";
import BirthAutoFillComponent from "../components/BirthAutoFillComponent";

const BirthScreen = () => {
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

  const [birthCertImage, setBirthCertImage] = useState(null);
  const [birthImageFileName, setBirthImageFileName] = useState("");

  const [porichoyVerificationResponse, setPorichoyVerificationResponse] =
    useState("");

  const [birthIamgeUploadLoading, setBirthImageUploadLoading] = useState(false);
  const [birthImageUploaded, setBirthImageUploaded] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const [dob, setDob] = useState("");
  const [name, setName] = useState("");
  const [birthRegNo, setBirthRegNo] = useState("");

  const pickBirhCertificate = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission to access camera is required!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setBirthCertImage(result.assets[0].uri);
      uploadBirthCert(result.assets[0].base64);
    }
  };

  const uploadBirthCert = async (base64Image) => {
    setBirthImageUploadLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/upload-birth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64Image }),
      });

      const data = await response.json();

      if (data.fileName) {
        setBirthImageFileName(data.fileName);
      } else {
        Alert.alert(
          "Failed to upload Birth Certificate",
          `Error: ${data.message}`
        );
      }
    } catch (error) {
      Alert.alert("An error occurred", error.message);
    } finally {
      setBirthImageUploadLoading(false);
      setBirthImageUploaded(true);
    }
  };

  //Function to detect texts
  const detectBirhNo = async () => {
    setVerifyLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/detect-birthno`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileName: birthImageFileName }),
      });
      const result = await response.json();

      // Accessing the values correctly
      const { birthRegistrationNumber, dateOfBirth } = result.data;

      setDob(dateOfBirth);
      setBirthRegNo(birthRegistrationNumber);

      if (result.data) {
        Alert.alert(
          "Text detection successful!",
          `Detected Text: ${JSON.stringify(result.data)}`
        );
        await porichoyBirth(birthRegistrationNumber, dateOfBirth);
      } else {
        Alert.alert("Failed to detect text", `Error: ${result.message}`);
      }
    } catch (error) {
      //Alert.alert("An error occurred", error.message);
      Alert.alert(
        "Provide valid english birth certificate",
        "Issued by Bangladesh government"
      );
    } finally {
      setVerifyLoading(false);
    }
  };

  const porichoyBirth = async (birthRegistrationNumber, dateOfBirth) => {
    console.log("call porichoy Api");
    const apiUrl = `${BASE_URL}/porichoy-birth`;
    try {
      const response = await axios.post(
        apiUrl,
        {
          birthRegistrationNumber,
          dateOfBirth,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Porichoy Birth API response:", response.data);
      setPorichoyVerificationResponse(response.data.status);
      setName(response.data.data.birthRegistration.fullNameEN);
      Alert.alert("VALIDATION DONE! THROUGH PORICHOY ");
      // console.log(response.status);
    } catch (error) {
      console.error("Error calling Porichoy Basic API:", error);
      Alert.alert("Provide valid Birth Certificate");
    } finally {
      setVerifyLoading(false);
    }
  };

  const verifyBirthCertificate = async () => {
    await detectBirhNo();
  };

  return (
    <View style={styles.container}>
      <CustomLabel text="Birth certification image" />
      <MarginTop />
      <View style={styles.widePlaceholderContainer}>
        {birthIamgeUploadLoading && <CustomActivityIndicator />}
        {birthCertImage ? (
          <CustomImage source={{ uri: birthCertImage }} />
        ) : (
          !birthIamgeUploadLoading && <PlaceholderImage />
        )}
      </View>

      <MarginTop />
      <CustomButton
        buttonStyle={{ width: "60%" }}
        onPress={pickBirhCertificate}
        // disabled={birthImageUploaded}
        text="Take Birth Certificate"
        showIcon={birthImageUploaded}
      />
      <MarginTop />
      <CustomButton
        onPress={verifyBirthCertificate}
        // disabled={porichoyVerificationResponse === "YES"}
        text="Verify"
        showIcon={porichoyVerificationResponse === "YES"}
        loading={verifyLoading}
      />
      {porichoyVerificationResponse ? (
        <BirthAutoFillComponent dob={dob} birthRegNo={birthRegNo} name={name} />
      ) : null}
    </View>
  );
};

export default BirthScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  widePlaceholderContainer: {
    position: "relative",
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
});
