import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from  "firebase/storage";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBI_k1NkgHT_KEnk_AAa4T8xAv8BkXE5XU",
  authDomain: "varejo-ec4e4.firebaseapp.com",
  projectId: "varejo-ec4e4",
  storageBucket: "varejo-ec4e4.appspot.com",
  messagingSenderId: "312149700974",
  appId: "1:312149700974:web:00225998649756ff1c117f"
};

// Inicialização do app Firebase
const app = initializeApp(firebaseConfig);

// Obtenção das instâncias dos serviços Firebase
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Exportando as instâncias dos serviços Firebase
export { db, auth, storage };