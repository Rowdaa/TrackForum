const dbconnection = require("../db/dbconfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function register(req, res) {
  const { username, firstname, lastname, email, password } = req.body;

  // user information validation
  if (!username || !firstname || !lastname || !email || !password) {
    return res.status(400).json("msg:please provide all required information");
  }
  //password validation lojic
  if (password.length < 8 || password.length > 20) {
    return res.status(400).json("your password length must between 8 and 20");
  }
  if (
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password) ||
    !/\d/.test(password)
  ) {
    return res
      .status(400)
      .json(
        "msg:password must contain atleast one uppercase, one lowercase and one digit"
      );
  } else {
    try {
      const [user] = await dbconnection.query(
        "SELECT username,userId FROM users WHERE username = ? or email = ?",
        [username, email]
      );
      if (user.length > 0) {
        return res.status(400).json("msg:you're already registered");
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await dbconnection.query(
        "INSERT INTO  users(username ,firstname, lastname, email, password) VALUES(?,?,?,?,?)",
        [username, firstname, lastname, email, hashedPassword]
      );
      return res.status(201).json("msg:user created successfully");
    } catch (error) {
      console.log(error.message);
      return res
        .status(500)
        .json("msg:something went wrong, please try again later");
    }
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("msg:please provide all necessary information");
  } else {
    try {
      const [user] = await dbconnection.query(
        "SELECT username, userId, password from users WHERE email = ?",
        [email, password]
      );
      if (user.length == 0) {
        return res.status(400).json("msg:This user is not registered");
      } else {
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
          return res
            .status(400)
            .json("msg:please provide all necessary information");
        } else {
          const username = user[0].username;
          const userid = user[0].userId;
          const token = jwt.sign({ username, userid }, "secret", {
            expiresIn: "1day",
          });
          return res
            .status(200)
            .json({ msg: "You're logged in successfully", token });
        }
      }
    } catch (error) {
      console.log(error.message);
      return res.status(500).json("msg:something went wrong");
    }
  }
}

function checkUser(req, res) {
  res.send("check");
}
module.exports = { register, login, checkUser };
