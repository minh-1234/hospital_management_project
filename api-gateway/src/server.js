import express from "express"
import cors from "cors"
import proxy from "express-http-proxy"
const app = express();
import 'dotenv/config'

const corsOptions = {
  origin: ['http://localhost:4000', "http://localhost"],
  credentials: true,
  optionSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(express.json());

app.use("/users", proxy("http://localhost:8001"));
app.use("/", proxy("http://localhost:8002"));

app.listen(process.env.PORT, () => {
  console.log(`Gateway is Listening on ${process.env.HOST_URL}`);
});