import { useContext, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import { ToastContainer, toast } from "react-toastify";
import Navbar from "../components/Navbar/Navbar.jsx";

const YourCourses = () => {
  const { backend, isLoggedIn, setisLoggedIn, setuserData, userData } =
    useContext(AppContent);
  let navigate = useNavigate();

  const [haveCourses, sethaveCourses] = useState("");
  const [courses, setcourses] = useState({});
  const [loading, setloading] = useState(true);

  useEffect(() => {
    try {
      async function fetchData() {
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

        const fetchCourse1 = await fetch(`${backend}/course/userCourse`, {
          method: "POST",
          credentials: "include",
        });
        const cdata = await fetchCourse1.json();
        console.log(cdata.message);
        setcourses(cdata.message.haveCourses);
      }
      fetchData();
    } catch (error) {
      console.log(error + "fetch failed");
    }
  }, []);

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false; // Mark it as no longer the first render
      return; // Skip the rest of the effect on the first render
    }
    setTimeout(() => {
      setloading(false);
    }, 500);
    console.log(userData);
    if (userData.sucess) {
      console.log("hello");
      sethaveCourses(userData.courses);
      setisLoggedIn(true);
      console.log(courses);
    } else {
      setisLoggedIn(false);
      navigate("/");
    }
  }, [userData, courses]);

  return (
    <>
      <Navbar />
      {/* seperation line */}
      <div className="spaceLine w-full h-[1px] bg-zinc-500"></div>
      {loading ? (
        <div className="w-full h-screen flex items-center justify-center text-white jet bg-zinc-800">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin  border-yellow-500 mx-auto"></div>
            <p className="text-zinc-600 mt-5 dark:text-zinc-400">
              Your <span className="text-green-500 jet">Learning</span> adventure is about to begin..
            </p>
          </div>
        </div>
      ) : (
        <>
          {haveCourses.length === 0 ? (
            <span className="flex h-[93vh] w-full justify-center items-center bg bg-zinc-900">
              <h1 className="md:text-6xl text-zinc-400 robot">
                It seems You have no courses ,{" "}
                <Link to="/home">
                  <button className="text-green-500 md:text-7xl underline jersey">
                    get some here
                  </button>
                </Link>
              </h1>
            </span>
          ) : (
            <>
              <div className="h-screen bg-zinc-900 w-full text-white jet p-5 flex flex-col">
                <div className="mt-10 h-[10vh] w-full flex flex-col py-2">
                  <span className="text-3xl">
                    {" "}
                    {userData.name}, Lets{" "}
                    <span className="text-green-500">Elevate</span> your
                    learning experience
                  </span>
                  <span className="text-zinc-400 mt-2 md:text-xl">
                    lets start learning
                  </span>
                </div>
                <div className="flex gap-7 flex-wrap mt-5">
                  {courses.length > 0 &&
                    courses.map((item) => {
                      return (
                        <div
                          key={item._id}
                          className="course h-[30vh] w-[256px] bg-zinc-600 rounded-xl cursor-pointer overflow-hidden"
                        >
                          <div className="h-[18vh] w-full">
                            <img
                              src={item.img}
                              alt=""
                              sizes=""
                              className="object-contain"
                            />
                            <h2 className="mt-2 px-2 name text-xl">
                              {item.name}
                            </h2>
                            <Link to={`/viewProfile/${item.by._id}`}>
                              <h3 className="px-2 text-zinc-400 hover:text-white transition-all ease-in-out duration-300">
                                By : {item.by.name}
                              </h3>
                            </Link>
                            <div className="px-2 mt-3 flex flex-wrap gap-4 h-[2vh]  items-center">
                              <Link to={`/watch/${item._id}`}>
                                <button className="text-green-500 border-1 border-zinc-400 bg-black rounded p-2  hover:text-white transition-all ease-in-out duration-300 jet font-semibold tracking-wide">
                                  Start learning
                                </button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default YourCourses;
