import { useEffect, useContext, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import { ToastContainer, toast } from "react-toastify";
import Navbar from "../components/Navbar/Navbar.jsx";

const BuyCourse = () => {
  const { backend, userData } = useContext(AppContent);
  const [course, setcourse] = useState("");
  const [tax, settax] = useState(0);
  const [ok, setok] = useState(false);
  const [loading, setloading] = useState(false);
  const [alreadyHave, setalreadyHave] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    try {
      console.log(userData)
      if (userData.haveCourses.includes(id)) {
        setalreadyHave(true);
      }
    } catch (error) {
      console.log(error);
    }
  });

  useEffect(() => {
    const fetchdata = async () => {
      try {
        let response = await fetch(`${backend}/course/getCourse`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            courseId: id,
          }),
          credentials: "include",
        });
        let data = await response.json();
        setcourse(data.message);
        console.log(data);
      } catch (error) {
        toast.error("Course errorr or not found");
        console.log(error);
      }
    };
    fetchdata();
  }, [id]);

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false; // Mark it as no longer the first render
      return; // Skip the rest of the effect on the first render
    }
    console.log(course);
    setok(true);
    taxCalc();
  }, [course]);

  const taxCalc = () => {
    const amount = parseInt(course.discountedprice);
    const result = (amount * 18) / 100;
    settax(result);
  };

  const confirmPurchase = async () => {
    setloading(true);
    const response = await fetch(`${backend}/course/buyCourse`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        courseId: id,
        payment: true,
      }), // Use raw object directly here
      credentials: "include",
    });

    const data = await response.json();
    if (data.sucess) {
      toast.success("purchases sucessfully");
    } else {
      toast.error(data.message);
    }
    setTimeout(() => {
      setloading(false);
    }, 800);
  };

  return (
    <>
      <ToastContainer />
      <Navbar />
      {/* seperation line */}
      <div className="spaceLine w-full h-[1px] bg-zinc-500"></div>
      {loading ? (
        <>
          <div className="h-[100vh] flex items-center justify-center bg-zinc-900">
            <div className="w-10 h-10 border-4 border-t-zinc-500 border-gray-300 rounded-full animate-spin"></div>
          </div>
        </>
      ) : (
        <>
          {ok ? (
            <div className="min-h-[100vh] w-full bg-zinc-900 p-5 overflow-hidden text-white flex gap-10 justify-center items-center flex-wrap">
              <div className=" h-[50vh] md:h-[100vh] w-full md:w-[40%] overflow-hidden">
                <span className="text-xl md:text-4xl">
                  Yahoo,{" "}
                  <span className="text-green-400 jet">
                    lets Start learning
                  </span>
                  <p className="text-xl text-zinc-400 mt-1 ml-3 jet">
                    Crafting amazing experience for learners
                  </p>
                </span>
                <div className="h-[70%] flex items-center justify-center w-full flex-col">
                  <div className="inline w-full">
                    <img
                      src={course.img}
                      alt="xyz"
                      className="mt-5 w-[400px] md:w-[400px]"
                    />
                  </div>
                  <div className="jet mt-4 text-2xl md:text-5xl w-full">
                    <h2 className="jet mt-4 text-2xl md:text-5xl">
                      {course.name}
                    </h2>
                    <Link
                      className="text-2xl hover:underline hover:text-blue-400 transition-all ease-in-out duration-500"
                      to={`/viewprofile/${course.by._id}`}
                    >
                      {" "}
                      - By {course.by.name}
                    </Link>
                  </div>
                </div>
              </div>
              <div className="md:h-[100vh] h-[1px] md:w-[1px] w-[100%] bg-zinc-300 "></div>
              <div className=" h-[70vh] md:h-[100vh] w-full md:w-[40%] p-3">
                <div className="text-4xl jet font-semibold flex items-center justify-center w-full h-[3vh]">
                  {" "}
                  Summary
                </div>
                <div className="h-[90%] w-full mt-2 flex items-center justify-center flex-col">
                  <div className="h-[50%] w-[80%] p-5 flex  tracking-wider flex-row jet">
                    <div className="w-[50%] flex items-center gap-3 flex-col">
                      <div className="text-xl w-full  ">Price</div>
                      <div className=" h-[1px] w-[100%] bg-zinc-300 "></div>
                      <div className="text-xl w-full text-green-500 ">
                        Off price
                      </div>
                      <div className=" h-[1px] w-[100%] bg-zinc-300 "></div>
                      <div className="text-xl  w-full">tax(18%)</div>
                      <div className=" h-[1px] w-[100%] bg-zinc-300 "></div>
                      <div className="text-xl  w-full">Sub total</div>
                      <div className=" h-[1px] w-[100%] bg-zinc-300 "></div>
                    </div>
                    <div className="w-[50%] flex items-center gap-3 flex-col">
                      <p className="text-xl">{course.price}$</p>
                      <div className=" h-[1px] w-[100%] bg-zinc-300 "></div>
                      <p className="text-xl text-green-400">
                        {course.discountedprice}$
                      </p>
                      <div className=" h-[1px] w-[100%] bg-zinc-300 "></div>
                      <p className="text-xl">{tax}$</p>
                      <div className=" h-[1px] w-[100%] bg-zinc-300 "></div>
                      <p className="text-xl text-blue-400">
                        {tax + course.discountedprice}$
                      </p>
                      <div className=" h-[1px] w-[100%] bg-zinc-300 "></div>
                    </div>
                  </div>
                  <div className="w-full h-[5vh%] flex justify-center items-center  ">
                    {alreadyHave ? (
                      <>
                        <Link to={'/yourCourses'}>
                        <button
                      onClick={() => confirmPurchase()}
                      className="text-green-500 border-1 border-zinc-400 bg-black rounded p-2  hover:text-white transition-all ease-in-out duration-300 jet font-semibold tracking-wide"
                    >
                      start learning
                    </button>
                        </Link>
                      </>
                    ) :  <button
                    onClick={() => confirmPurchase()}
                    className="text-green-500 border-1 border-zinc-400 bg-black rounded p-2  hover:text-white transition-all ease-in-out duration-300 jet font-semibold tracking-wide"
                  >
                    Confirm purchase
                   </button>}
                   
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[100vh] flex items-center justify-center bg-zinc-900">
              <div className="w-10 h-10 border-4 border-t-zinc-500 border-gray-300 rounded-full animate-spin"></div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default BuyCourse;
