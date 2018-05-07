const express = require("express");
const request = require("request");
const bodyparser = require("body-parser");
const bitcore = require("bitcore-lib");

const app = express();

app.use(
  bodyparser.urlencoded({
    extended: true
  })
);
app.use(bodyparser.json());
app.set("view engine", "ejs");

function brainWallet(uinput, callback) {
  const input = new Buffer(uinput);
  const hash = bitcore.crypto.Hash.sha256(input);
  const bn = bitcore.crypto.BN.fromBuffer(hash);
  const pk = new bitcore.PrivateKey(bn).toWIF();
  const addy = new bitcore.PrivateKey(bn).toAddress();
  callback(pk, addy);
}

request(
  {
    url: "https://api.coindesk.com/v1/bpi/currentprice.json",
    json: true
  },
  (err, res, body) => {
    price = body.bpi.USD.rate;
  }
);

app.get("/", (req, res) => {
  res.render("index", {
    lastPrice: price.trim()
  });
});

app.get("/brain", (req, res) => {
  res.render("brain", {
    lastPrice: price
  });
});

app.get("/converter", (req, res) => {
  console.log(price);
  res.render("converter", {
    lastPrice: price
  });
});

app.post("/wallet", (req, res) => {
  const brainsrc = req.body.brainsrc;
  console.log(brainsrc);
  brainWallet(brainsrc, (priv, addr) => {
    res.send(
      "brain wallet of  " +
        brainsrc +
        "<br>Addy: " +
        addr +
        "<br>Private Key: " +
        priv
    );
  });
});

app.listen(3000, () => {
  console.log("server started");
});
