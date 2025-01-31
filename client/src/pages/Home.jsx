import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import { ToastContainer, toast } from "react-toastify";
import Navbar from "../components/Navbar/Navbar.jsx";
import { Link } from "react-router-dom";

const Home = () => {
  const [Courses, setCourses] = useState([]);
  const { backend, isLoggedIn, setisLoggedIn, setuserData, userData } =
    useContext(AppContent);

  let navigate = useNavigate();

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
        const courses = await fetch(`${backend}/course/fetchCourse`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          credentials: "include",
        });
        const trending_courses = await courses.json();
        setCourses(trending_courses.message);
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
    console.log(userData);
    if (userData.sucess) {
      setisLoggedIn(true);
      toast.success("welcome " + userData.name);
      console.log(Courses);
      console.log(typeof Courses);
    } else {
      setisLoggedIn(false);
      navigate("/");
    }
  }, [userData]);

  return (
    <>
      <ToastContainer />
      {/* navbar */}
      <Navbar />
      {/* seperation line */}
      <div className="spaceLine w-full h-[1px] bg-zinc-500"></div>
      {/* if user is logged in show this */}
      {userData.sucess && (
        <div>
          <div className="welcome h-[20vh] md:j-[30vh] bg-zinc-900 text-white">
            <div className="hello flex justify-center items-center h-full w-full flex-col">
              <h1 className="text-7xl jersey">Hello {userData.name}</h1>
              <h2 className="text-zinc-500 robot">
                Welcome, to an amazing learning <span className="jet text-xl text-green-600 -tracking-wide">
                   Experience
                </span>
              </h2>
            </div>
          </div>
          {/* seperation line */}
          <div className="spaceLine w-full h-[1px] bg-zinc-500"></div>
          {/* our all popular courses */}
          <div className="popular text-white bg-zinc-900 min-h-[77vh] robot">
            <div className="px-10 pt-10">
              <h3 className="text-xl md:text-3xl font-semibold robot">
                Trending Courses
              </h3>
            </div>
            {/* list of courses */}
            <div className="p-10 flex flex-wrap gap-7 AllCourses">
              {/* courrses */}
              {Courses.length > 0 &&
                Courses.map((item) => {
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
                        <h2 className="mt-2 px-2 name text-xl">{item.name}</h2>
                        <Link to={`/viewProfile/${item.by._id}`}>
                          <h3 className="px-2 text-zinc-400 hover:text-blue-400 hover:underline transition-all ease-in-out duration-300">
                            By : {item.by.name}
                          </h3>
                        </Link>
                        <div className="px-2 mt-3 flex flex-wrap gap-4 h-[2vh]  items-center">
                          <h3 className="">
                            <span className="line-through mr-3 text-red-500">
                              {item.price}$
                            </span>
                            {item.discountedprice}$
                          </h3>
                          <Link to={`/buycourse/${item._id}`}>
                            <button
                              className=" jet text-xl w-32 h-12 rounded bg-zinc-950 text-white relative overflow-hidden group z-10 hover:text-white duration-1000"
                            >
                              <span className=" jet absolute bg-zinc-800 w-36 h-36 blur-xl  text-green-500 rounded-full group-hover:scale-100 scale-0 -z-10 -left-2 -top-10 group-hover:duration-500 duration-700 origin-center transform transition-all"></span>
                              <span className=" jet absolute bg-black text-green-500  w-36 h-36 -left-2 -top-10 rounded-full group-hover:scale-100 scale-0 -z-10 group-hover:duration-700 duration-500 origin-center transform transition-all"></span>
                              Buy now
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
