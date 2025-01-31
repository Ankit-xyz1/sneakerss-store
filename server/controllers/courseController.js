import UserModel from "../models/userModel.js";
import courseModel from "../models/courses.js";

export const createCourse = async (req, res) => {
  console.log(req.CurrrentUser);
  let Cuser = await UserModel.findOne({ _id: req.CurrrentUser.id });
  if (!req.body.img || !req.body.name || !req.body.dprice) {
    return res.json({
      sucess: false,
      message: "image , name or price is missing",
    });
  }
  let course = await courseModel.create({
    img: req.body.img,
    name: req.body.name,
    by: Cuser._id,
    price: req.body.price,
    discountedprice: req.body.dprice,
  });
  await Cuser.CreatedCourse.push(course._id);
  await Cuser.save();
  return res.json({ sucess: true, message: "your course created sucessfully" });
};

export const getCourse = async (req, res) => {
  console.log(req.body.courseId);
  if (!req.body.courseId) {
    return res.json({ sucess: false, message: "course not found" });
  }
  let id = req.body.courseId;
  let course = await courseModel
    .findOne({ _id: id })
    .populate("by", "name email");
  return res.json({ sucess: true, message: course });
};

export const FetchCourse = async (req, res) => {
  let FetchedCourses = await courseModel
    .find({ trending: true })
    .populate("by", "name email");
  return res.json({ sucess: true, message: FetchedCourses });
};

export const buyCourse = async (req, res) => {
  try {
    const isPaymentSucessfull = req.body.payment;
    if (!isPaymentSucessfull) {
      return res.json({ sucess: false, message: "payment failed" });
    }
    const userId = req.CurrrentUser.id;
    const courseId = req.body.courseId;
    const currentUser = await UserModel.findOne({ _id: userId });
    let have = await currentUser.haveCourses.includes(courseId);
    if (have) {
      return res.json({ sucess: false, message: "already buyed" });
    }
    await currentUser.haveCourses.push(courseId);
    await currentUser.save();

    return res.json({ sucess: true, message: "course buyed scuessfully" });
  } catch (error) {
    return res.json({ sucess: false, message: "something went wrong", error });
  }
};

export const fethcUserCourse = async (req, res) => {
  try {
    const userId = req.CurrrentUser.id;
    const currentUser = await UserModel.findOne({ _id: userId }).populate({
      path: 'haveCourses', // Populate `haveCourses`
      select: 'name img by', // Select specific fields from the `haveCourses`
      populate: {
        path: 'by', // Populate the `by` field in `haveCourses`
        select: 'name email', // Select specific fields from the `by` field (UserModel)
      },
    });
    return res.json({sucess: true , message:currentUser})
  } catch (error) {
    console.log(error)
    return
  }
};

export const fetchCreatedCourse = async(req,res) => {
  const userId = req.CurrrentUser.id;
  if(!req.CurrrentUser.id){
    return res.json({sucess: false , message: "user not found"})
  }

  try {
    const currentUser = await UserModel.findOne({ _id: userId }).populate("CreatedCourse","_id , img , name");
    return res.json({sucess: true , message: currentUser.CreatedCourse})
  } catch (error) {
    return res.json({sucess: false , message: "something went wrong" , error:error})
  }
}
