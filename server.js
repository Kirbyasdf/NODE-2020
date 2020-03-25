require("dotenv").config({ path: "./config/.env" });
const app = require("express")();
const bootCampRouter = require("./routes/bootcamps.route.js");

const PORT = process.env.PORT || 4000;

app.use("/api/v1/bootcamps", bootCampRouter);

app.listen(PORT, () =>
  console.log(
    `RUNNING ::: ${process.env.NODE_ENV} ::: - GOOD 2 GO on PORT: ` + PORT
  )
);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ type: "error", message: err.message });
});

app.get("/", (req, res) => res.send("working"));
