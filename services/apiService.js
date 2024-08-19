// const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

// export const uploadImage = async (endpoint, base64Image) => {
//   try {
//     const response = await fetch(`${BASE_URL}/${endpoint}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ image: base64Image }),
//     });

//     return await response.json();
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

// export const detectFace = async (imageUrl) => {
//   try {
//     const response = await fetch(`${BASE_URL}/detect-face`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ imageUrl }),
//     });

//     return await response.json();
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

// export const compareFaces = async (selfieUrl, nidUrl) => {
//   try {
//     const response = await fetch(`${BASE_URL}/compare-face`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ selfieUrl, nidUrl }),
//     });

//     return await response.json();
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

// export const porichoyBasic = async (name, dob, nid) => {
//   try {
//     const response = await axios.post(
//       `${BASE_URL}/porichoy-basic`,
//       { name, dob, nid },
//       { headers: { "Content-Type": "application/json" } }
//     );

//     return response.data;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };
