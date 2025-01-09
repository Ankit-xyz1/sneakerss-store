import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { AppContent } from "../context/AppContext";


const Login = () => {
  const navigate= useNavigate()

  const [signup, setsignup] = useState("signup");

  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const { backend , setisLoggedIn} = useContext(AppContent);

  const handleSubmit = async () => {
    console.log(name, email, password);

    // Validation
    if (!name || !email || !password) {
      return toast.error("Please fill all the details.");
    }
    if (password.length < 8) {
      return toast.error("Password cannot be less than 8 characters.");
    }

    try {
      if (signup === "signup") {
        // Handle Signup
        const raw = {
          name,
          email,
          password,
        };

        const response = await fetch("http://localhost:4000/auth/signup", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(raw), // Use raw object directly here
          credentials: "include"
        });
        setisLoggedIn(true)

        const data = await response.json()  // Convert the response to JSON
        console.log(data)

        if (data.success===false) {
          return toast.error(data.message + "Signup failed");
        }
        toast.success("Signed up successfully.");
        navigate('/home')
      } else {
        // Handle Login
        const response = await axios.post(backend + "/auth/login", {
          email,
          password, // Send login credentials
        });

        if (!response.data.success) {
          return toast.error(response.data.message || "Login failed");
        }
        toast.success("Logged in successfully.");
      }

      // Reset fields after successful submission
      setname("");
      setemail("");
      setpassword("");
    } catch (error) {
      console.log(error);
      toast.error(
        "Error: " + error.message || "Unable to process the request."
      );
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="login min-h-screen w-full bg-zinc-900 flex justify-center items-center text-white">
        <div className="h-[50vh] bg-zinc-800 w-[30%] p-4 rounded-md flex flex-col justify-center">
          <div className="flex justify-center">
            <h1 className=" text-2xl">
              {signup === "signup" ? " Signup your acc" : "Login your acc"}
            </h1>
          </div>
          <div className="text-white flex flex-col gap-4 mt-5 items-center">
            {signup === "signup" && (
              <input
                value={name}
                onChange={(e) => setname(e.target.value)}
                className="outline-none w-80 h-10   bg-zinc-600 rounded-md p-2"
                type="text"
                placeholder="Enter your name"
                name="name"
              />
            )}
            <input
              value={email}
              onChange={(e) => setemail(e.target.value)}
              className="outline-none w-80 h-10  bg-zinc-600 rounded-md p-2"
              type="email"
              placeholder="Enter your email"
              name="email"
            />
            <input
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              className="outline-none w-80 h-10  bg-zinc-600 rounded-md p-2"
              type="password"
              placeholder="Enter your password"
              name="password"
            />
            {signup === "signup" && (
              <p
                className="text-zinc-500 hover:cursor-pointer"
                onClick={() => setsignup("login")}
              >
                login now
              </p>
            )}
            {signup === "login" && (
              <p
                className="text-zinc-500 hover:cursor-pointer"
                onClick={() => setsignup("signup")}
              >
                signup now
              </p>
            )}
            <button onClick={() => handleSubmit()}>
              {signup === "signup" ? " Signup" : "Login"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
