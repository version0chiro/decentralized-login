var express = require("express");

var crypto = require("crypto");

const jwt = require("jsonwebtoken");
// import { recoverPersonalSignature } from "eth-sig-util";

const recoverPersonalSignature =
  require("eth-sig-util").recoverPersonalSignature;

const metaAuth = require("../models/metaMask");

var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    console.log(req.headers.authorization);
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECERT, (err, user) => {
      try {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
      } catch (err) {
        console.log(err);
        res.sendStatus(403);
      }
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(403);
  }
}

router.get("/test/posts", authenticate, (req, res) => {
  console.log("user");

  try {
    res.json({
      message: "success",
      user: req.user,
    });
  } catch (err) {
    console.log(err);
    res.send("error");
  }
});

router.post("/auth/login", async (req, res) => {
  const nouce = `Hey! Sign this message to prove you have access to this wallet. This won't cost you anything.\n\nSecurity code (you can ignore this): ${req.session.token}`;

  const signature = recoverPersonalSignature({
    data: nouce,
    sig: req.body.signature,
  });

  if (req.body.address.toLowerCase() === signature.toLowerCase()) {
    const user = { address: req.body.address, signature: req.body.signature };

    const accessToken = await jwt.sign(
      user,
      process.env.ACCESS_TOKEN_SECERT,

      (err, token) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        } else {
          console.log("something");
          res.json({ token });
        }
      }
    );
  } else {
    res.send("error");
  }
});

router.get("/auth/getToken", async (req, res) => {
  try {
    req.session.token = crypto.randomBytes(16).toString("hex");
    req.session.save();
    console.log(req.session.token);

    res.end(
      `Hey! Sign this message to prove you have access to this wallet. This won't cost you anything.\n\nSecurity code (you can ignore this): ${req.session.token}`
    );
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
