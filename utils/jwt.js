const jwt = require("jsonwebtoken");

const generateToken = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_KEY, {
    expiresIn: "1d",
  });
  return token;
};

const attachCookiesToResponse = ({ res, user }) => {
  const tokenUser = {
    name: user.name,
    userId: user._id,
    role: user.role,
  };
  const token = generateToken({ payload: tokenUser });
  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    signed: true,
  });
};

const verifyToken = ({ token }) => {
  return jwt.verify(token, process.env.JWT_KEY);
};

module.exports = { generateToken, attachCookiesToResponse, verifyToken };
