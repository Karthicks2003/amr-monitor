// // ========================================
// // Login.jsx
// // ========================================

// import { useState } from "react";
// import axios from "axios";
// import {
//   Link,
//   useNavigate,
// } from "react-router-dom";

// import "../styles/Login.css";

// function Login() {

//   const [name, setName] =
//     useState("");

//   const [password, setPassword] =
//     useState("");

//   const navigate =
//     useNavigate();

//   // ========================================
//   // LOGIN
//   // ========================================

//   const loginUser = async () => {

//     try {

//       const response =
//         await axios.post(
//           "https://occupant-perm-neurosis.ngrok-free.dev/login",
//           {
//             name,
//             password,
//           }
//         );

//       const token =
//         response.data.token;

//       localStorage.setItem(
//         "token",
//         token
//       );

//       navigate("/home");

//     } catch (error) {

//       console.log(error);

//       alert(
//         error.response?.data?.detail ||
//         "Login Failed"
//       );
//     }
//   };

//   return (

//     <div className="login-page">

//       {/* ========================================
//           BACKGROUND GLOW
//       ======================================== */}

//       <div className="bg-glow glow1"></div>

//       <div className="bg-glow glow2"></div>

//       {/* ========================================
//           LOGIN CARD
//       ======================================== */}

//       <div className="login-card">

//         {/* LOGO */}

//         <div className="login-logo">

//           🤖

//         </div>

//         {/* TITLE */}

//         <h1 className="login-title">
//           AMR Fleet System
//         </h1>

//         <p className="login-subtitle">
//           Autonomous Mobile Robot
//           Monitoring Dashboard
//         </p>

//         {/* INPUTS */}

//         <div className="input-group">

//           <label>
//             Username
//           </label>

//           <input
//             type="text"
//             placeholder="Enter username"
//             value={name}
//             onChange={(e) =>
//               setName(e.target.value)
//             }
//           />

//         </div>

//         <div className="input-group">

//           <label>
//             Password
//           </label>

//           <input
//             type="password"
//             placeholder="Enter password"
//             value={password}
//             onChange={(e) =>
//               setPassword(e.target.value)
//             }
//             onKeyDown={(e) => {

//               if (e.key === "Enter") {

//                 loginUser();
//               }
//             }}
//           />

//         </div>

//         {/* BUTTON */}

//         <button
//           className="login-btn"
//           onClick={loginUser}
//         >
//           Login
//         </button>

//         {/* FOOTER */}

//         <p className="login-footer">

//           Don’t have an account?

//           <Link
//             to="/register"
//             className="login-link"
//           >
//             Register
//           </Link>

//         </p>

//       </div>

//     </div>
//   );
// }

// export default Login;

// ========================================
// Login.jsx
// ========================================

import { useState } from "react";
import axios from "axios";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import "../styles/Login.css";

const API_URL = import.meta.env.VITE_API_URL;

function Login() {

  const [name, setName] =
    useState("");

  const [password, setPassword] =
    useState("");

  const navigate =
    useNavigate();

  // ========================================
  // LOGIN
  // ========================================

  const loginUser = async () => {

    try {

      const response =
        await axios.post(
          `${API_URL}/login`,
          {
            name,
            password,
          }
        );

      const token =
        response.data.token;

      localStorage.setItem(
        "token",
        token
      );

      navigate("/home");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.detail ||
        "Login Failed"
      );
    }
  };

  return (

    <div className="login-page">

      {/* ========================================
          BACKGROUND GLOW
      ======================================== */}

      <div className="bg-glow glow1"></div>

      <div className="bg-glow glow2"></div>

      {/* ========================================
          LOGIN CARD
      ======================================== */}

      <div className="login-card">

        {/* LOGO */}

        <div className="login-logo">

          🤖

        </div>

        {/* TITLE */}

        <h1 className="login-title">
          AMR Fleet System
        </h1>

        <p className="login-subtitle">
          Autonomous Mobile Robot
          Monitoring Dashboard
        </p>

        {/* INPUTS */}

        <div className="input-group">

          <label>
            Username
          </label>

          <input
            type="text"
            placeholder="Enter username"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

        </div>

        <div className="input-group">

          <label>
            Password
          </label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            onKeyDown={(e) => {

              if (e.key === "Enter") {

                loginUser();
              }
            }}
          />

        </div>

        {/* BUTTON */}

        <button
          className="login-btn"
          onClick={loginUser}
        >
          Login
        </button>

        {/* FOOTER */}

        <p className="login-footer">

          Don't have an account?

          <Link
            to="/register"
            className="login-link"
          >
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;
