// import { useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";

// import "../styles/Register.css";

// function Register() {

//   const [name, setName] = useState("");
//   const [password, setPassword] = useState("");

//   const registerUser = async () => {

//     try {

//       const response = await axios.post(
//         "https://occupant-perm-neurosis.ngrok-free.dev/register",
//         {
//           name,
//           password
//         }
//       );

//       alert(response.data.status);

//     } catch (error) {

//       console.log(error);

//       alert("Register Failed");

//     }
//   };

//   return (

//     <div className="register-container">

//       <div className="register-card">

//         {/* LOGO */}

//         <div className="register-logo">
//           🤖
//         </div>

//         {/* TITLE */}

//         <h1 className="register-title">
//           Create Account
//         </h1>

//         <p className="register-subtitle">
//           Register for AMR Fleet Dashboard
//         </p>

//         {/* INPUTS */}

//         <input
//           type="text"
//           placeholder="Username"
//           value={name}
//           onChange={(e) =>
//             setName(e.target.value)
//           }
//           className="register-input"
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) =>
//             setPassword(e.target.value)
//           }
//           className="register-input"
//         />

//         {/* BUTTON */}

//         <button
//           onClick={registerUser}
//           className="register-button"
//         >
//           Create Account
//         </button>

//         {/* FOOTER */}

//         <p className="register-footer">

//           Already have an account?

//           <Link
//             to="/"
//             className="register-link"
//           >
//             Login
//           </Link>

//         </p>

//       </div>

//     </div>
//   );
// }

// export default Register;

import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import "../styles/Register.css";

const API_URL = import.meta.env.VITE_API_URL;

function Register() {

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const registerUser = async () => {

    try {

      const response = await axios.post(
        `${API_URL}/register`,
        {
          name,
          password
        }
      );

      alert(response.data.status);

    } catch (error) {

      console.log(error);

      alert("Register Failed");

    }
  };

  return (

    <div className="register-container">

      <div className="register-card">

        {/* LOGO */}

        <div className="register-logo">
          🤖
        </div>

        {/* TITLE */}

        <h1 className="register-title">
          Create Account
        </h1>

        <p className="register-subtitle">
          Register for AMR Fleet Dashboard
        </p>

        {/* INPUTS */}

        <input
          type="text"
          placeholder="Username"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="register-input"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="register-input"
        />

        {/* BUTTON */}

        <button
          onClick={registerUser}
          className="register-button"
        >
          Create Account
        </button>

        {/* FOOTER */}

        <p className="register-footer">

          Already have an account?

          <Link
            to="/"
            className="register-link"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;
