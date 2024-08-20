import React, { useState } from "react";
import { View, Alert, Text, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import CustomLabel from "../components/CustomLabel";
import CustomImage from "../components/CustomImage";
import PlaceholderImage from "../components/PlaceholderImage";
import CustomActivityIndicator from "../components/CustomActivityIndicator";
import MarginTop from "../components/spacer/MarginTop";
import CustomButton from "../components/CustomButton";
import PassportAutofillComponent from "../components/PassportAutofillComponent";

const NidScreen = () => {
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

  const [passportImage, setPassportImage] = useState(null);
  const [passportUrl, setPassportUrl] = useState("");

  const [passportNumber, setPassportNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [personalNumber, setPersonalNumber] = useState("");

  const [passportFaceDetectResult, setPassportFaceDetectResult] = useState("");
  const [passportVerificationStatus, setPassportVerificationStatus] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const pickPassport = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission to access camera is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setPassportImage(result.assets[0].uri);
      uploadPassport(result.assets[0].base64);
    }
  };

  const uploadPassport = async (base64Image) => {
    setLoading(true);
    setPassportFaceDetectResult("");
    try {
      const response = await fetch(`${BASE_URL}/upload-passport`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64Image }),
      });

      const data = await response.json();
      if (data.imageUrl) {
        setPassportUrl(data.imageUrl);
        detectFace(data.imageUrl, setPassportFaceDetectResult);
        // Alert.alert(
        //   "Passport uploaded successfully!",
        //   `Passport URL: ${data.imageUrl}`
        // );
      } else {
        Alert.alert("Failed to upload passport", `Error: ${data.message}`);
      }
    } catch (error) {
      Alert.alert("An error occurred", error.message);
    } finally {
      setLoading(false);
    }
  };

  const detectFace = async (imageUrl, setComparisonResult) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/detect-face`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      });

      const data = await response.json();
      //console.log(data);
      if (data.faceDetected) {
        setComparisonResult("success");
      } else {
        //Alert.alert("Failed to detect face", `Error: ${data.message}`);
        setComparisonResult("error");
      }
    } catch (error) {
      Alert.alert("An error occurred", error.message);
      setComparisonResult("error");
    } finally {
      setLoading(false);
    }
  };

  // Function to compare faces using the third API
  const verifyPassport = async () => {
    if (!passportUrl) {
      Alert.alert("Please upload passport image first!");
      return;
    }
    setVerifyLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/analyze-passport`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl: passportUrl }),
      });

      const data = await response.json();
      console.log(data);

      if (data.passportVerificationStatus) {
        Alert.alert(
          "Valid assport verification done!",
          `Response: ${JSON.stringify(data)}`
        );
        setPassportNumber(data.responseData.passportNumber);
        setBirthDate(data.responseData.birthDate);
        setExpirationDate(data.responseData.expirationDate);
        setPersonalNumber(data.responseData.personalNumber);
        setPassportVerificationStatus(data.passportVerificationStatus);
      } else {
        Alert.alert("Passport is invalid");
      }
    } catch (error) {
      Alert.alert("An error occurred", error.message);
      setPassportVerificationStatus(false);
    } finally {
      setLoading(false);
      setVerifyLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <CustomLabel text="Passport image" />
      <MarginTop />
      <View style={styles.widePlaceholderContainer}>
        {loading && <CustomActivityIndicator />}
        {passportImage ? (
          <CustomImage source={{ uri: passportImage }} />
        ) : (
          !loading && <PlaceholderImage />
        )}
      </View>

      {passportFaceDetectResult === "error" && !loading && (
        <Text style={styles.errorMessage}>
          Please upload valid passport image
        </Text>
      )}
      <MarginTop />
      <CustomButton
        buttonStyle={{ width: "60%" }}
        onPress={pickPassport}
        disabled={loading || passportFaceDetectResult === "success"}
        text="Take passport image"
        showIcon={passportFaceDetectResult === "success"}
      />

      <MarginTop />
      <CustomButton
        buttonStyle={{ width: "50%" }}
        onPress={verifyPassport}
        disabled={passportVerificationStatus}
        text="Verify passport"
        showIcon={passportVerificationStatus}
        loading={verifyLoading}
      />

      {passportVerificationStatus ? (
        <PassportAutofillComponent
          passportNumber={passportNumber}
          birthDate={birthDate}
          expirationDate={expirationDate}
          personalNumber={personalNumber}
        />
      ) : null}
    </View>
  );
};

export default NidScreen;

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
  errorMessage: {
    color: "red",
  },
});
