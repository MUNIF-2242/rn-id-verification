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
import { FontAwesome } from "@expo/vector-icons";

const NidScreen = () => {
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const [selfieImage, setSelfieImage] = useState(null);
  const [selfieUrl, setSelfieUrl] = useState("");
  const [nidImage, setNidImage] = useState(null);
  const [nidUrl, setNidUrl] = useState("");
  const [faceComparisonResult, setFaceComparisonResult] = useState("");
  const [nidFaceComparisonResult, setNidFaceComparisonResult] = useState("");

  const [loading, setLoading] = useState(false);
  const [nidLoading, setNidLoading] = useState(false);

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
        setSelfieUrl(data.imageUrl);
        detectFace(data.imageUrl, setFaceComparisonResult);
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
      setTimeout(() => setLoading(false), 500);
    }
  };

  const pickNid = async () => {
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
      setNidImage(result.assets[0].uri);
      uploadNid(result.assets[0].base64);
    }
  };

  const uploadNid = async (base64Image) => {
    setNidLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/upload-nid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64Image }),
      });

      const data = await response.json();
      if (response.ok) {
        setNidUrl(data.imageUrl);
        detectFace(data.imageUrl, setNidFaceComparisonResult);
        Alert.alert("NID uploaded successfully!", `NID URL: ${data.imageUrl}`);
      } else {
        Alert.alert("Failed to upload NID", `Error: ${data.message}`);
      }
    } catch (error) {
      Alert.alert("An error occurred", error.message);
    } finally {
      // Adding a small delay to ensure the loading indicator is visible briefly
      setTimeout(() => setNidLoading(false), 500);
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
      if (response.ok) {
        console.log(`Face Detection Result: ${JSON.stringify(data)}`);
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

  return (
    <View style={styles.container}>
      <Text>Profile image</Text>
      <View style={styles.topSpacer} />
      <View style={styles.profilePlaceholderContainer}>
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
            style={{ width: 100, height: 100 }}
          />
        ) : (
          !loading && <View style={styles.profilePlaceholderImageStyle}></View>
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
            size={20}
            color="#fff"
            style={styles.icon}
          />
        )}
      </TouchableOpacity>
      {faceComparisonResult === "error" && !loading && (
        <Text style={styles.errorMessage}>Please take a face image</Text>
      )}

      <View style={styles.topSpacer} />

      <Text>NID image</Text>
      <View style={styles.topSpacer} />
      <View style={styles.profilePlaceholderContainer}>
        {nidLoading && (
          <ActivityIndicator
            size="large"
            color="#fff"
            style={styles.loadingIndicator}
          />
        )}
        {nidImage ? (
          <Image
            source={{ uri: nidImage }}
            style={{ width: 100, height: 100 }}
          />
        ) : (
          !nidLoading && (
            <View style={styles.profilePlaceholderImageStyle}></View>
          )
        )}
      </View>
      <View style={styles.topSpacer} />
      <TouchableOpacity
        style={styles.button}
        onPress={pickNid}
        disabled={nidLoading || nidFaceComparisonResult === "success"}
      >
        <Text style={styles.buttonText}>Take NID</Text>
        {nidFaceComparisonResult === "success" && (
          <FontAwesome
            name="check"
            size={20}
            color="#fff"
            style={styles.icon}
          />
        )}
      </TouchableOpacity>
      {nidFaceComparisonResult === "error" && !nidLoading && (
        <Text style={styles.errorMessage}>Please take an NID image</Text>
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
  topSpacer: { marginTop: 15 },
  profilePlaceholderContainer: {
    position: "relative",
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  profilePlaceholderImageStyle: {
    width: 100,
    height: 100,
    backgroundColor: "gray",
    opacity: 0.1,
  },
  loadingIndicator: {
    position: "absolute",
    zIndex: 1,
  },
  button: {
    width: "50%",
    flexDirection: "row",
    backgroundColor: "#8e44ad",
    padding: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  icon: {
    marginLeft: 8,
  },
  errorMessage: {
    color: "red",
  },
});
