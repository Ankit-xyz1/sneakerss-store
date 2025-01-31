import jwt from "jsonwebtoken";


export const isAuthenticated = (req, res , next) => {
  let token = req.cookies.token;
  console.log(token)
  if (token) {
    const data = jwt.verify(token, process.env.SECRET_KEY);
    if (!data) {
      return res.json({
        sucess: false,
        Message: " user authentication failed",
      });
    }
    console.log(data);
    req.CurrrentUser = data;
    return next()
  } else {
    return res.json({ sucess: false, Message: " user authentication failedx" });
}
};


