// import bcryptjs from 'bcryptjs';
import {
  Alert,
  Button,
  FileInput,
  Select,
  TextInput,
  Textarea,
} from "flowbite-react";
import { useState } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";

const SECRET_PASS = import.meta.env.VITE_SECRET_PASS

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Seleziona una immagine");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        // eslint-disable-next-line no-unused-vars
        (error) => {
          setImageUploadError("Download immagine fallita!");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Download immagine fallita!");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError("Oooops! Qualcosa e' andato storto");
    }
  };

  const [open, setOpen] = useState(false);
  const toggle = () => {
    setOpen(!open);
  };

  const [errorMessage, setErrorMessage] = useState("");

  const [screen, setScreen] = useState("encrypt");
  const [text, setText] = useState("");

  // Store Encrypted data
  const [encryptedData, setEncryptedData] = useState("");

  // Store Decrypted data
  const [decryptedData, setDecryptedData] = useState("");

  // Switch between encrypt and decrypt screens
  const switchScreen = (type) => {
    setScreen(type);
    // Clear all data and error message when switching screens
    setText("");
    setEncryptedData("");
    setDecryptedData("");
    setErrorMessage("");
  };

  // Encrypt user input text
  const encryptData = () => {
    try {
      const data = CryptoJS.AES.encrypt(
        JSON.stringify(text),
        SECRET_PASS
      ).toString();
      setEncryptedData(data);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Encryption fallita. Controlla il tuo input!");
    }
  };

  // Decrypt user input text
  const decryptData = () => {
    try {
      const bytes = CryptoJS.AES.decrypt(text, SECRET_PASS);
      const data =JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      setDecryptedData(data);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Decryption fallita. Controlla il tuo input!");
    }
  };

  // Handle button click (Encrypt or Decript)
  const handleClick = () => {
    if (!text) {
      setErrorMessage("Please enter some text");
      return;
    }

    if (screen === "encrypt") {
      encryptData();
    } else {
      decryptData();
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-serif">Crea nuova voce</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Nuova voce (campo obblig. ed univoco)*"
            required
            id="title"
            className="flex-1 "
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="tutte">Tutte le categorie</option>
            <option value="personali">Personali</option>
            <option value="ufficio">Ufficio</option>
            <option value="sitiweb">Siti Web</option>
            <option value="social">Social Network</option>
            <option value="emailaddress">Email</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="pinkToOrange"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Scarica immagine"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}
        <div className="flex flex-col gap-5 border-4 border-green-500    border-dotted p-3">
          <Textarea
            className="font-serif"
            rows={4}
            placeholder="Inserire qualcosa per ricordare...."
            id="testolibero"
            onChange={(e) =>
              setFormData({ ...formData, testolibero: e.target.value })
            }
          />
          <TextInput
            className="font-serif"
            type="email"
            placeholder="Inserire solo formato email (xxxx@dominio.com)"
            id="email"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <div className="relative text-2xl">
            <TextInput
              className="font-serif max-w-full"
              type={open === false ? "password" : "text"}
              placeholder="Password"
              id="password"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <div className="absolute top-2 right-3">
              {open === false ? (
                <AiFillEye onClick={toggle} className="cursor-pointer" />
              ) : (
                <AiFillEyeInvisible
                  onClick={toggle}
                  className="cursor-pointer"
                />
              )}
            </div>
          </div>
        </div>
        {/* -------------- Encrypt and Decrypt --------------- */}
        <div className="self-center">
          <div>
            {/* Buttons to switch between Encrypt and Decrypt screens */}
            <span
              className={`btn btn-left ${screen === "encrypt" ? "active" : ""} cursor-pointer`}
              onClick={() => {
                switchScreen("encrypt");
              }}
            >
              Encrypt
            </span>
            <span
              className={`btn btn-right ${
                screen === "decrypt" ? "active" : ""
              } cursor-pointer`}
              onClick={() => {
                switchScreen("decrypt");
              }}
            >
              Decrypt
            </span>
          </div>

          <div className="card">
            {/* Textarea for user input  */}
            <textarea
              value={text}
              onChange={({ target }) => setText(target.value)}
              placeholder={
                screen === "encrypt"
                  ? "Enter your text... "
                  : "Enter Encrypted Data"
              }
            />

            {/* Display error message if there is an error */}
            {errorMessage && <div className="error">{errorMessage}</div>}

            {/* Encrypt or Decrypt button */}
            <span
              className={`btn submit-btn ${
                screen === "encrypt" ? "encrypt-btn" : "decrypt-btn"
              } cursor-pointer`}
              onClick={handleClick}
            >
              {screen === "encrypt" ? "Encrypt" : "Decript"}
            </span>
          </div>

          {/* Display Encrypted or Decrypted data if available */}
          {encryptedData || decryptedData ? (
            <div className="content">
              <label>
                {screen === "encrypt" ? "ENCRYPTED" : "Decrypted"} DATA
              </label>
              <p>{screen === "encrypt" ? encryptedData : decryptedData}</p>
            </div>
          ) : null}
        </div>

        <Button type="submit" gradientDuoTone="cyanToBlue" outline>
          Salva dati
        </Button>
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
