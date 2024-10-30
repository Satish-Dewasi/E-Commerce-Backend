import jwt from "jsonwebtoken";

export default (res, userId) => {
  // creating JWT token
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // prepare options
  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  };

  // seding response
  //console.log("token sent");

  res.cookie("token", token, options);
};
