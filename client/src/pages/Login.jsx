import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { AppContent } from "../context/AppContext";

const Login = () => {
  const navigate = useNavigate();

  const [signup, setsignup] = useState("signup");

  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const { backend, setisLoggedIn } = useContext(AppContent);

  const handleSubmit = async () => {
    console.log(name, email, password);

    // Validation
    if (!email || !password) {
      return toast.error("Please fill all the details.");
    }
    if (password.length < 8) {
      return toast.error("Password cannot be less than 8 characters.");
    }

    try {
      if (signup == "signup") {
        // Handle Signup
        const raw = {
          name,
          email,
          password,
        };

        //sending fethc rerquet forr signup
        const response = await fetch(`${backend}/auth/signup`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(raw), // Use raw object directly here
          credentials: "include",
        });

        //cheking for response frrom the server
        const data = await response.json(); // Convert the response to JSON

        //if sucess is false user will be returned
        if (data.success === false) {
          return toast.error(data.message + "Signup failed");
        }

        //if not loggined will be true and user will be navigated to home page
        setisLoggedIn(true);
        navigate("/home");
        toast.success("Signed up successfully.");
      } else {
        // Handle Login
        try {
          //sending the fetch request
          const response = await fetch("http://localhost:4000/auth/login", {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
              email,
              password,
            }), // Use raw object directly here
            credentials: "include",
          });

          // checking for the data from the server
          const data = await response.json(); // Convert the response to JSON
          console.log(data);

          //if user cant login he will be returned
          if (data.sucess == false) {
            return toast.error(data.message);
          }

          //if login is sucessfull the stae will cahnge and user will be navigated
          setisLoggedIn(true);
          navigate("/home");
          toast.success("Logged in successfully.");
        } catch (error) {
          toast.success("unsucesfull" + error);
        }
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
      <div className="login min-h-screen w-full bg-zinc-900 flex justify-center items-center text-white jet">
        <div className="h-[50vh] bg-zinc-800 w-[90%] md:w-[40%] p-4 rounded-md flex flex-col justify-center">
          <div className="flex justify-center">
            <h1 className=" text-l md:text-xl jet">
              {signup === "signup" ? <> Signup your acc to <p className="inline text-green-500">SkillHuddle</p> </> : <> Signup your acc to <p className="inline text-green-500">SkillHuddle</p> </>}
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
                className="text-zinc-500 hover:cursor-pointer hover:text-white transition-all duration-500 ease-in-out"
                onClick={() => setsignup("login")}
              >
                login now
              </p>
            )}
            {signup === "login" && (
              <p
                className="text-zinc-500 hover:cursor-pointer hover:text-white transition-all duration-500 ease-in-out"
                onClick={() => setsignup("signup")}
              >
                signup now
              </p>
            )}
            <button onClick={() => handleSubmit()}>
              {signup === "signup" ? (
                <button className="text-xl w-32 h-12 rounded bg-emerald-500 text-white relative overflow-hidden group z-10 hover:text-white duration-1000">
                  <span className="absolute bg-emerald-600 w-36 h-36 rounded-full group-hover:scale-100 scale-0 -z-10 -left-2 -top-10 group-hover:duration-500 duration-700 origin-center transform transition-all"></span>
                  <span className="absolute bg-emerald-800 w-36 h-36 -left-2 -top-10 rounded-full group-hover:scale-100 scale-0 -z-10 group-hover:duration-700 duration-500 origin-center transform transition-all"></span>
                  Signup
                </button>
              ) : (
                <button className="text-xl w-32 h-12 rounded bg-emerald-500 text-white relative overflow-hidden group z-10 hover:text-white duration-1000">
                  <span className="absolute bg-emerald-600 w-36 h-36 rounded-full group-hover:scale-100 scale-0 -z-10 -left-2 -top-10 group-hover:duration-500 duration-700 origin-center transform transition-all"></span>
                  <span className="absolute bg-emerald-800 w-36 h-36 -left-2 -top-10 rounded-full group-hover:scale-100 scale-0 -z-10 group-hover:duration-700 duration-500 origin-center transform transition-all"></span>
                  Login
                </button>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
