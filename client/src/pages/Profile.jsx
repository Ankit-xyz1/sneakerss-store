import { useEffect, useRef, useContext, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import { AppContent } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import CreatedCourse from "../components/Navbar/CreatedCourse";
const Profile = () => {
  const navigate = useNavigate();

  const [refresed, setrefresed] = useState(false);

  const { backend, userData, setuserData, setisLoggedIn } =
    useContext(AppContent);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false; // Mark it as no longer the first render
      return; // Skip the rest of the effect on the first render
    }
    console.log(userData);
    if (userData.sucess) {
      setisLoggedIn(true);
    } else {
      setisLoggedIn(false);
      navigate("/");
    }
  }, [userData]);

  const isFirstRender = useRef(true);

  useEffect(() => {
    async function LoggedInchecker() {
      const response = await fetch(`${backend}/auth/loggedin`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        credentials: "include",
      });
      let userDetails = await response.json();
      setuserData(userDetails);
      setrefresed(true);
    }
    LoggedInchecker();
  }, [refresed]);

  const logout = async () => {
    console.log("loggedout");
    let response = await fetch(`${backend}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    let data = await response.json();
    if (data.sucess) {
      navigate("/");
    } else {
      alert("failed");
    }
  };

  const Createpage = ()=>{
    navigate('/createCourse')
  }

  return (
    <>
      <Navbar />
      {/* seperation line */}
      <div className="spaceLine w-full h-[1px] bg-zinc-500"></div>
      {refresed && (
        <>
          <div className="min-h-screen w-full bg-zinc-900 flex overflow-hidden justify-center">
            <div className="w-full md:w-[40%] bg-zinc-900 min-h-screen p-6 ">
              <div className=" h-fit w-full flex px-7  bg-zinc-700 rounded-xl p-4 overflow-hidden gap-3 justify-center items-center md:justify-start md:items-start md:flex-row flex-col flex-wrap">
                <div className="h-fit md:w-[50%] w-full bg-zinc-900 rounded p-2 flex flex-col pl-5">
                  <h2 className="text-white jet md:text-3xl font-semibold robot tracking-wider">
                    {userData.name}
                  </h2>
                  <span className="text-zinc-500 robot">{userData.email}</span>
                  <span className=" text-zinc-300 md:text">
                    <Link to={"/yourCourses"} className="hover:underline">
                      {" "}
                      Courses : {userData.courses.length}
                    </Link>
                  </span>
                </div>
                <div className="h-full flex  justify-center items-center md:w-[40%] mt-6 w-full">
                  <div className="">
                    <button
                    onClick={()=>Createpage()}
                      className="flex justify-center gap-2 items-center mx-auto shadow-xl text-lg bg-gray-50 backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-emerald-500 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group"
                    >
                      Create Course
                      <svg
                        className="w-8 h-8 justify-end group-hover:rotate-90 group-hover:bg-gray-50 text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-2 rotate-45"
                        viewBox="0 0 16 19"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                          className="fill-gray-800 group-hover:fill-gray-800"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-full min-h-screen bg-zinc-700 p-4 mt-5 rounded-xl overflow-auto ">
                <CreatedCourse />
              </div>
              <div className="w-full p-5 mt-10 flex items-center justify-center">
                <button
                  onClick={() => logout()}
                  className="text-xl w-32 h-12 rounded bg-red-500 text-white relative overflow-hidden group z-10 hover:text-white duration-1000"
                >
                  <span className="absolute bg-red-600 w-36 h-36 rounded-full group-hover:scale-100 scale-0 -z-10 -left-2 -top-10 group-hover:duration-500 duration-700 origin-center transform transition-all"></span>
                  <span className="absolute bg-red-800 w-36 h-36 -left-2 -top-10 rounded-full group-hover:scale-100 scale-0 -z-10 group-hover:duration-700 duration-500 origin-center transform transition-all"></span>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Profile;
