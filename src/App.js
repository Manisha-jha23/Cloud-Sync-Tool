// import { useState } from "react";

// function App() {
//   const [email, setEmail] = useState("");
//   const [file, setFile] = useState(null);
//   const [message, setMessage] = useState("");

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!email || !file) {
//       setMessage("Please enter email and select a file.");
//       return;
//     }

//     try {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = async () => {
//         const base64File = reader.result.split(",")[1];

//         const payload = {
//           email: email,
//           fileName: file.name,
//           fileContent: base64File,
//         };

//         const response = await fetch(
//           "https://op7sm4di3d.execute-api.eu-north-1.amazonaws.com/upload",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(payload),
//           }
//         );

//         if (response.ok) {
//           setMessage("File uploaded successfully!");
//         } else {
//           setMessage("Upload failed.");
//         }
//       };
//     } catch (err) {
//       console.error(err);
//       setMessage("Error uploading file.");
//     }
//   };

//   return (
//     <div style={{ padding: "50px", fontFamily: "Arial" }}>
//       <h1>Cloud Sync Tool</h1>
//       <div style={{ marginBottom: "20px" }}>
//         <label>Email: </label>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           style={{ marginLeft: "10px", padding: "5px" }}
//         />
//       </div>
//       <div style={{ marginBottom: "20px" }}>
//         <label>Choose File: </label>
//         <input type="file" onChange={handleFileChange} />
//       </div>
//       <button onClick={handleUpload} style={{ padding: "10px 20px" }}>
//         Upload
//       </button>
//       {message && (
//         <div style={{ marginTop: "20px", fontWeight: "bold" }}>{message}</div>
//       )}
//     </div>
//   );
// }
// export default App;

import { useState, useEffect } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setEmail(storedUser);
      setIsLoggedIn(true);
    }
  }, []);

  // ✅ Password validation only when submitting
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/;
    return regex.test(password);
  };

  // ✅ Register new user
  const handleRegister = () => {
    if (!email || !password) {
      setMessage("Please enter both email and password.");
      return;
    }
    if (!validatePassword(password)) {
      setMessage(
        "Password must have at least 1 uppercase, 1 number, 1 special char, and be ≥6 characters."
      );
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || {};
    if (users[email]) {
      setMessage("User already exists. Please login.");
      return;
    }
    users[email] = password;
    localStorage.setItem("users", JSON.stringify(users));
    setMessage("🎉 Registration successful! Please login.");
    setIsRegisterMode(false);
  };

  // ✅ Login
  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users")) || {};
    if (users[email] === password) {
      setIsLoggedIn(true);
      localStorage.setItem("loggedInUser", email);
      setMessage("");
    } else {
      setMessage("Invalid email or password.");
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
    setFile(null);
    setMessage("Logged out successfully.");
  };

  // ✅ File selection
  const handleFileChange = (e) => setFile(e.target.files[0]);

  // ✅ File upload
  const handleUpload = async () => {
    if (!email || !file) {
      setMessage("Please select a file to upload.");
      return;
    }

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64File = reader.result.split(",")[1];
        const payload = {
          email: email,
          fileName: file.name,
          fileContent: base64File,
        };

        const response = await fetch(
          "https://op7sm4di3d.execute-api.eu-north-1.amazonaws.com/upload",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        if (response.ok) {
          setMessage("✅ File uploaded successfully!");
        } else {
          setMessage("❌ Upload failed. Please try again.");
        }
      };
    } catch (err) {
      console.error(err);
      setMessage("Error uploading file.");
    }
  };

  // 🌈 Styling
  const pageStyle = {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "'Poppins', sans-serif",
  };

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    padding: "30px 40px",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginTop: "8px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "14px",
  };

  const buttonStyle = {
    background: "#667eea",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    margin: "5px",
    transition: "0.3s",
  };

  const secondaryButton = {
    ...buttonStyle,
    background: "#764ba2",
  };

  // 🔐 Login / Register Page
  if (!isLoggedIn) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h1>{isRegisterMode ? "Create Account" : "Welcome Back"}</h1>
          <p style={{ fontSize: "14px", color: "#666" }}>
            {isRegisterMode
              ? "Register to start uploading files securely"
              : "Login to your cloud storage"}
          </p>

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          <button style={buttonStyle} onClick={isRegisterMode ? handleRegister : handleLogin}>
            {isRegisterMode ? "Register" : "Login"}
          </button>

          <button
            style={secondaryButton}
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setMessage("");
            }}
          >
            {isRegisterMode ? "Back to Login" : "New User? Register"}
          </button>

          {message && <p style={{ marginTop: "15px", color: "red" }}>{message}</p>}
        </div>
      </div>
    );
  }

  // ☁️ File Upload Page
  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2>Welcome, {email}</h2>
        <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
          Upload your files securely to the cloud
        </p>

        <input type="file" onChange={handleFileChange} style={{ marginBottom: "15px" }} />

        <div>
          <button style={buttonStyle} onClick={handleUpload}>
            Upload
          </button>
          <button style={secondaryButton} onClick={handleLogout}>
            Logout
          </button>
        </div>

        {message && (
          <p
            style={{
              marginTop: "20px",
              fontWeight: "600",
              color: message.includes("✅") ? "green" : "red",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
