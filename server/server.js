import app from "./app.js";
import { connect } from "./db/index.js";

const port = process.env.PORT || 3001;
app.listen(port, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`Server listening on ${port}`);
  connect();
});
