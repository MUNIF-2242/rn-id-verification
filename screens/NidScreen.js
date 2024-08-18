import React, { useState } from "react";
import {
  View,
  Image,
  Alert,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons"; // Import FontAwesome

const NidScreen = () => {
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const [selfieImage, setSelfieImage] = useState(null);
  const [selfieUrl, setSelfieUrl] = useState("");
  const [faceComparisonResult, setFaceComparisonResult] = useState("");

  const [loading, setLoading] = useState(false);

  // Function to handle picking a selfie from the gallery
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
        setSelfieUrl(data.imageUrl); // Assuming the response contains the URL of the uploaded selfie
        detectFace(data.imageUrl);
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

  const detectFace = async (imageUrl) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/detect-face`, // Replace with your actual API endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageUrl }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        //console.log(`Face Detection Result: ${JSON.stringify(data)}`);
        setFaceComparisonResult(data.faceDetected ? "success" : "error");
      } else {
        Alert.alert("Failed to detect face", `Error: ${data.message}`);
        setFaceComparisonResult("error");
      }
    } catch (error) {
      Alert.alert("An error occurred", error.message);
      setFaceComparisonResult("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Profile image</Text>
      <View style={styles.topSpacer} />
      <View style={styles.profilePlaceholdeContainer}>
        {loading && (
          <ActivityIndicator
            size="large"
            color="#fff"
            style={styles.loadingIndicator}
          />
        )}
        {selfieImage ? (
          <Image
            source={{ uri: selfieImage }}
            style={styles.profileImageStyle}
          />
        ) : (
          <View style={styles.profilePlaceholdeImageStyle}></View>
        )}
      </View>
      <View style={styles.topSpacer} />
      <TouchableOpacity
        style={styles.button}
        onPress={pickSelfie}
        disabled={loading || faceComparisonResult === "success"}
      >
        <Text style={styles.buttonText}>Take Selfie</Text>
        {faceComparisonResult === "success" && (
          <FontAwesome
            name="check"
            size={16}
            color="#fff"
            style={styles.icon}
          />
        )}
      </TouchableOpacity>
      {faceComparisonResult === "error" && !loading && (
        <Text style={styles.errorMessage}>
          Uploaded image does not contain face
        </Text>
      )}
    </View>
  );
};

export default NidScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  label: { fontWeight: "900", fontSize: 12 },
  topSpacer: { marginTop: 15 },
  profilePlaceholdeContainer: {
    position: "relative",
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  profilePlaceholdeImageStyle: {
    width: 100,
    height: 100,
    backgroundColor: "gray",
    opacity: 0.1,
  },
  profileImageStyle: {
    width: 100,
    height: 100,
  },
  loadingIndicator: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -15,
    marginTop: -15,
    zIndex: 1,
  },
  button: {
    width: "50%",
    paddingVertical: 10,
    backgroundColor: "#8e44ad",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    textTransform: "none",
  },
  icon: {
    marginLeft: 10,
  },
  errorMessage: {
    color: "red",
    marginTop: 10,
  },
});
