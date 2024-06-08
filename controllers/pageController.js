import fs from "fs";

const getIndexPage = (req, res) => {
  res.render("index", {
    link: "index",
  });
};

const getAboutPage = (req, res) => {
  res.render("about", {
    link: "about",
  });
};

const getRegisterPage = (req, res) => {
  res.render("register", {
    link: "register",
  });
};

const bringData = (req, res) => {
  fs.readFile("AddressData.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const addressData = JSON.parse(data);
      res.json(addressData);
    }
  });
};

const getLoginPage = (req, res) => {
  res.render("login", {
    link: "login",
  });
};

const getContactPage = (req, res) => {
  res.render("contact", {
    link: "contact",
    message: false,
  });
};

const getLogout = (req, res) => {
  res.cookie("jwt", "", {
    maxAge: "1",
  });
  res.redirect("/");
};

export {
  getIndexPage,
  getAboutPage,
  getRegisterPage,
  getLoginPage,
  getLogout,
  getContactPage,
  bringData,
};
