import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import firebase from "firebase/compat";
import "firebase/compat/database";

export const fetchAllImages = (uid) => {
  let imgData = [];
  firebase
    .firestore()
    .collection("cards")
    // .doc(uid)
    .doc(uid)
    .get()
    .then((querySnapshot) => {
      console.log("Total users: ", querySnapshot.data());
      imgData.push(querySnapshot.data());
      console.log("New img data:", imgData);
      // querySnapshot.forEach((documentSnapshot) => {
      //   console.log("User ID: ", documentSnapshot.id, documentSnapshot.data());
      //   imgData.push(documentSnapshot.data());
      //   console.log("IMAGE DATA:", imgData);
      // });
    });
  return imgData;
};

// Upload Image Coding Below -------

// Comment here

export const uploadImage = async (data, imageName, colName, title) => {
  const storage = getStorage();
  try {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", data, true);
      xhr.send(null);
    });
    const imageRef = ref(storage, `images/${imageName}`);
    await uploadBytes(imageRef, blob).then(async (snapshot) => {
      let imgUrl = await getDownloadURL(imageRef).then((res) => {
        const { uid } = firebase.auth().currentUser;
        firebase
          .firestore()
          .collection("TestData")
          .doc(uid)
          .collection("cards")
          .add(
            {
              imageUrl: res,
              title: title ? title : "",
              // Add more fields as needed
            }
            // { merge: true }
          )
          .then((res) => {
            alert("Certificate uploaded Successfully");
            console.log(uid);
          })
          .catch((err) => {
            console.log("err", err);
          });
      });
      console.log("Uploaded a blob or file!");
    });
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};
