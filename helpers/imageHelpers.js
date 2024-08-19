// import * as ImagePicker from "expo-image-picker";
// import { Alert } from "react-native";

// export const pickImage = async () => {
//   const permissionResult =
//     await ImagePicker.requestMediaLibraryPermissionsAsync();

//   if (!permissionResult.granted) {
//     Alert.alert("Permission to access camera is required!");
//     return null;
//   }

//   const result = await ImagePicker.launchImageLibraryAsync({
//     mediaTypes: ImagePicker.MediaTypeOptions.Images,
//     allowsEditing: true,
//     aspect: [4, 3],
//     quality: 1,
//     base64: true,
//   });

//   return result;
// };
