require("dotenv").config({ path: "./config/.env" });
const app = require("express")();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () =>
  console.log(
    `RUNNING ::: ${process.env.NODE_ENV} ::: - GOOD 2 GO on PORT: ` + PORT
  )
);

app.get("/", (req, res) => res.send("lol"));
