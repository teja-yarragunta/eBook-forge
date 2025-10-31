const validator = require("validator");

const validateSignup = (req) => {
  const { name, email, password } = req.body;

  if (!name || name.trim() === "" || name.trim().length < 3) {
    throw new Error("Invalid FirstName.");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Invalid Email.");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Invalid password. Password isn't strong enough.");
  }
};

module.exports = { validateSignup };
