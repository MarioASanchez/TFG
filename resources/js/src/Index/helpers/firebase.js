// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAXx97YgnSB2W8dZDi3c-x8z003psRLLUU",
  authDomain: "nueva-bbdd.firebaseapp.com",
  databaseURL: "https://nueva-bbdd-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "nueva-bbdd",
  storageBucket: "nueva-bbdd.firebasestorage.app",
  messagingSenderId: "670263437564",
  appId: "1:670263437564:web:4d25bfda1d2aa5ae2acf79"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export async function recibirUsuarios() {
  let url = "https://nueva-bbdd-default-rtdb.europe-west1.firebasedatabase.app/usuarios.json";
  const datatype = await fetch(url);
  const response = await datatype.json();
  if (response == null) {
    return [];
  } else {
    return response;
  }
}

export async function guardarUsuarios(array) {
  const datosJSON = JSON.stringify(array);
  let url = "https://nueva-bbdd-default-rtdb.europe-west1.firebasedatabase.app/usuarios.json";
  const datatype = await fetch(url, {
    method: 'PUT',
    body: datosJSON,
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const response = await datatype.json();
  console.log(response);
}


