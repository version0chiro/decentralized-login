var express = require("express");

var crypto = require("crypto");
// import { recoverPersonalSignature } from "eth-sig-util";

const recoverPersonalSignature =
  require("eth-sig-util").recoverPersonalSignature;

const metaAuth = require("../models/metaMask");

var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// router.get("/something/:x", function (req, res, next) {
//   console.log(req.params.x);
//   res.send("something");
// });

// router.get("/auth/:MetaAddress", metaAuth, (req, res) => {
//   console.log(metaAuth);
//   try {
//     res.send(req.metaAuth.recovered);
//   } catch (err) {
//     console.log(err);
//   }
// });

// router.get("/auth/:MetaMessage/:MetaSignature", metaAuth, (req, res) => {
//   if (req.metaAuth.recovered) {
//     res.send(req.metaAuth.recovered);
//   } else {
//     res.send("error");
//   }
// });

router.post("/auth/login", async (req, res) => {
  const nouce = `Hey! Sign this message to prove you have access to this wallet. This won't cost you anything.\n\nSecurity code (you can ignore this): ${req.session.token}`;

  const signature = recoverPersonalSignature({
    data: nouce,
    sig: req.body.signature,
  });

  if (req.body.address.toLowerCase() === signature.toLowerCase()) {
    
    res.send("success");
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
