import React, { useState } from "react";
import { View, Alert, Text, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import CustomLabel from "../components/CustomLabel";
import CustomImage from "../components/CustomImage";
import PlaceholderImage from "../components/PlaceholderImage";
import AutofillComponent from "../components/AutofillComponent";
import CustomActivityIndicator from "../components/CustomActivityIndicator";
import MarginTop from "../components/spacer/MarginTop";
import CustomButton from "../components/CustomButton";

const NidScreen = () => {
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

  const [selfieImage, setSelfieImage] = useState(null);
  const [selfieUrl, setSelfieUrl] = useState("");
  const [nidImage, setNidImage] = useState(null);
  const [nidUrl, setNidUrl] = useState("");

  const [selfieFaceDetectResult, setSelfieFaceDetectResult] = useState("");
  const [nidFaceDetectResult, setNidFaceDetectResult] = useState("");
  const [porichoyVerificationResponse, setPorichoyVerificationResponse] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [nidLoading, setNidLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [nid, setNid] = useState("");

  const pickSelfie = async () => {
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
      if (data.imageUrl) {
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
      // Adding a small delay to ensure the loading indicator is visible briefly
      setLoading(false);
    }
  };

  const pickNid = async () => {
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
      setNidImage(result.assets[0].uri);
      uploadNid(result.assets[0].base64);
    }
  };

  const uploadNid = async (base64Image) => {
    setNidLoading(true);
    setNidFaceDetectResult("");
    try {
      const response = await fetch(`${BASE_URL}/upload-nid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64Image }),
      });

      const data = await response.json();
      if (data.imageUrl) {
        setNidUrl(data.imageUrl);
        detectFace(data.imageUrl, setNidFaceDetectResult);
        Alert.alert("NID uploaded successfully!", `NID URL: ${data.imageUrl}`);
      } else {
        Alert.alert("Failed to upload NID", `Error: ${data.message}`);
      }
    } catch (error) {
      Alert.alert("An error occurred", error.message);
    } finally {
      setNidLoading(false);
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
    if (!selfieUrl || !nidUrl) {
      Alert.alert("Please upload both selfie and NID images first!");
      return;
    }
    setVerifyLoading(true);
    try {
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
      const response = await fetch(`${BASE_URL}/detect-text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileName: "nid.jpg" }),
      });
      const data = await response.json();
      console.log(data);
      setName(data.nidData.name);
      setDob(data.nidData.dob);
      setNid(data.nidData.nid);
      console.log(`Detected Text:` + data.nidData.name);
      if (data.status == "success") {
        console.log(`Detected Text: ${JSON.stringify(data)}`);
        Alert.alert(
          "Text detection successful!",
          `Detected Text: ${JSON.stringify(data)}`
        );
        await porichoyBasic(
          data.nidData.name,
          data.nidData.dob,
          data.nidData.nid
        );
      } else {
        Alert.alert("Please provide valid NID frontside image");
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
      //console.log("Porichoy Basic API response:", response.data);

      if (response.data.passKyc === "no") {
        Alert.alert("Provide valid NID");
      } else {
        setPorichoyVerificationResponse(response.data.passKyc);
        Alert.alert("VALIDATION DONE! THROUGH PORICHOY ");
      }
    } catch (error) {
      console.error("Error calling Porichoy Basic API:", error);
      Alert.alert("Provide valid NID");
    } finally {
    }
  };

  const verifyNid = async () => {
    await compareFaces();
  };

  return (
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
        onPress={pickSelfie}
        // disabled={loading || selfieFaceDetectResult === "success"}
        text="Upload selfie"
        showIcon={selfieFaceDetectResult === "success"}
      />

      <MarginTop />
      <CustomLabel text="NID image" />
      <MarginTop />
      <View style={styles.widePlaceholderContainer}>
        {nidLoading && <CustomActivityIndicator />}
        {nidImage ? (
          <CustomImage source={{ uri: nidImage }} />
        ) : (
          !nidLoading && <PlaceholderImage />
        )}
      </View>
      {nidFaceDetectResult === "error" && !nidLoading && (
        <Text style={styles.errorMessage}>Please upload valid NID image</Text>
      )}
      <MarginTop />
      <CustomButton
        buttonStyle={{ width: "50%" }}
        onPress={pickNid}
        // disabled={nidLoading || nidFaceDetectResult === "success"}
        text="Upload NID image"
        showIcon={nidFaceDetectResult === "success"}
      />

      <MarginTop />
      <CustomButton
        onPress={verifyNid}
        // disabled={porichoyVerificationResponse === "yes"}
        text="Verify NID"
        showIcon={porichoyVerificationResponse === "yes"}
        loading={verifyLoading}
      />
      {porichoyVerificationResponse === "yes" ? (
        <AutofillComponent name={name} dob={dob} nid={nid} />
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
