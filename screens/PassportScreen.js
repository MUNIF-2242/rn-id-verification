import React, { useState } from "react";
import { View, Alert, Text, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import CustomLabel from "../components/CustomLabel";
import CustomImage from "../components/CustomImage";
import PlaceholderImage from "../components/PlaceholderImage";
import PassportAutofillComponent from "../components/PassportAutofillComponent";
import CustomActivityIndicator from "../components/CustomActivityIndicator";
import MarginTop from "../components/spacer/MarginTop";
import CustomButton from "../components/CustomButton";
import { ScrollView } from "react-native";

const PassportScreen = () => {
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

  const [selfieImage, setSelfieImage] = useState(null);
  const [selfieUrl, setSelfieUrl] = useState("");
  const [passportImage, setPassportImage] = useState(null);
  const [passportUrl, setPassportUrl] = useState("");

  const [selfieFaceDetectResult, setSelfieFaceDetectResult] = useState("");
  const [passportFaceDetectResult, setPassportFaceDetectResult] = useState("");
  const [porichoyVerificationResponse, setPorichoyVerificationResponse] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [passportLoading, setPassportLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [nid, setNid] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");

  const pickSelfie = async () => {
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
      setSelfieImage(result.assets[0].uri);
      uploadSelfie(result.assets[0].base64);
    }
  };

  const uploadSelfie = async (base64Image) => {
    setLoading(true);
    setSelfieFaceDetectResult("");
    try {
      const response = await fetch(`${BASE_URL}/upload-selfie`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64Image }),
      });

      const data = await response.json();
      if (response.ok) {
        setSelfieUrl(data.imageUrl);
        detectFace(data.imageUrl, setSelfieFaceDetectResult);
        Alert.alert(
          "Selfie uploaded successfully!",
          `Selfie URL: ${data.imageUrl}`
        );
      } else {
        Alert.alert("Failed to upload selfie", `Error: ${data.message}`);
      }
    } catch (error) {
      Alert.alert("An error occurred", error.message);
    } finally {
      setLoading(false);
    }
  };

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
    setPassportLoading(true);
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
        Alert.alert(
          "Passport uploaded successfully!",
          `Passport URL: ${data.imageUrl}`
        );
      } else {
        Alert.alert(
          "Failed to upload passport image",
          `Error: ${data.message}`
        );
      }
    } catch (error) {
      Alert.alert("An error occurred", error.message);
    } finally {
      setPassportLoading(false);
    }
  };

  const detectFace = async (imageUrl, setComparisonResult) => {
    try {
      const response = await fetch(`${BASE_URL}/detect-face`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      });

      const data = await response.json();
      if (response.ok) {
        setComparisonResult(data.faceDetected ? "success" : "error");
      } else {
        Alert.alert("Failed to detect face", `Error: ${data.message}`);
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
  const compareFaces = async () => {
    if (!selfieUrl || !passportUrl) {
      Alert.alert("Please upload both selfie and passport images first!");
      return;
    }
    setVerifyLoading(true);

    try {
      const nidUrl = passportUrl;
      const response = await fetch(`${BASE_URL}/compare-face`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selfieUrl, nidUrl }),
      });

      const data = await response.json();

      if (data.matched) {
        Alert.alert(
          "Face comparison successful!",
          `Response: ${JSON.stringify(data)}`
        );
        await detectTexts();
      } else {
        Alert.alert("Face comparison unsuccessful", "The faces did not match.");
      }
    } catch (error) {
      Alert.alert("An error occurred", error.message);
    } finally {
      setLoading(false);
      setVerifyLoading(false);
    }
  };

  //Function to detect texts
  const detectTexts = async () => {
    console.log("face matced and detect text call");
    try {
      const response = await fetch(`${BASE_URL}/analyze-passport`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl: passportUrl }),
      });
      const data = await response.json();
      setName(data.passportData.name);
      setDob(data.passportData.birthDate);
      setNid(data.passportData.personalNumber);
      setPassportNumber(data.passportData.passportNumber);
      setExpirationDate(data.passportData.expirationDate);

      console.log(data.passportData.name);

      if (data.status == "success") {
        console.log(`Detected Text: ${JSON.stringify(data)}`);
        Alert.alert(
          "Text detection successful!",
          `Detected Text: ${JSON.stringify(data)}`
        );
        console.log(data.passportData.name);
        await porichoyBasic(
          data.passportData.name,
          data.passportData.birthDate,
          data.passportData.personalNumber
        );
      } else {
        Alert.alert("Please provide valid Passport image");
      }
    } catch (error) {
      Alert.alert("An error occurred", error.message);
    } finally {
      setVerifyLoading(false);
    }
  };

  const porichoyBasic = async (name, dob, nid) => {
    const apiUrl = `${BASE_URL}/porichoy-basic`;
    try {
      const response = await axios.post(
        apiUrl,
        {
          name,
          dob,
          nid,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Porichoy Basic API response:", response.data);
      setPorichoyVerificationResponse(response.data.passKyc);

      if (response.data.passKyc === "no") {
        Alert.alert("Provide valid passport");
      } else {
        setPorichoyVerificationResponse(response.data.passKyc);
        Alert.alert("VALIDATION DONE! THROUGH PORICHOY ");
      }
    } catch (error) {
      console.error("Error calling Porichoy Basic API:", error);
      Alert.alert("Please provide valid passport porichoy response");
    } finally {
    }
  };

  const verifyPassport = async () => {
    await compareFaces();
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <CustomLabel text="Profile image" />
        <MarginTop />
        <View style={styles.profilePlaceholderContainer}>
          {loading && <CustomActivityIndicator />}
          {selfieImage ? (
            <CustomImage
              source={{ uri: selfieImage }}
              style={{ width: 100, height: 100 }}
            />
          ) : (
            !loading && (
              <PlaceholderImage extrastyle={{ width: 100, height: 100 }} />
            )
          )}
        </View>
        {selfieFaceDetectResult === "error" && !loading && (
          <Text style={styles.errorMessage}>Image does not contain face</Text>
        )}
        <MarginTop />
        <CustomButton
          buttonStyle={{ width: "55%" }}
          onPress={pickSelfie}
          disabled={loading || selfieFaceDetectResult === "success"}
          text="Upload selfie"
          showIcon={selfieFaceDetectResult === "success"}
        />
        <MarginTop />
        <CustomLabel text="Passport image" />
        <MarginTop />
        <View style={styles.widePlaceholderContainer}>
          {passportLoading && <CustomActivityIndicator />}
          {passportImage ? (
            <CustomImage source={{ uri: passportImage }} />
          ) : (
            !passportLoading && <PlaceholderImage />
          )}
        </View>
        {passportFaceDetectResult === "error" && !passportLoading && (
          <Text style={styles.errorMessage}>
            Please upload valid passport image
          </Text>
        )}
        <MarginTop />
        <CustomButton
          buttonStyle={{ width: "55%" }}
          onPress={pickPassport}
          disabled={passportLoading || passportFaceDetectResult === "success"}
          text="Take passport image"
          showIcon={passportFaceDetectResult === "success"}
        />
        <MarginTop />
        <CustomButton
          buttonStyle={{ width: "55%" }}
          onPress={verifyPassport}
          disabled={porichoyVerificationResponse === "yes"}
          text="Verify Passport"
          showIcon={porichoyVerificationResponse === "yes"}
          loading={verifyLoading}
        />

        {porichoyVerificationResponse === "yes" ? (
          <PassportAutofillComponent
            passportNumber={passportNumber}
            birthDate={dob}
            expirationDate={expirationDate}
            personalNumber={nid}
          />
        ) : null}
      </View>
    </ScrollView>
  );
};

export default PassportScreen;

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
