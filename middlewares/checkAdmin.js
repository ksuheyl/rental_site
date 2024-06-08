import adminRoute from "../routes/adminRoute.js";

const checkAdmin = (req, res) => {
  if (res.locals.user.role == "admin") {
    adminRoute(req, res);
  } else {
    res.status(404).send("Not Found");
  }
};
export { checkAdmin };
