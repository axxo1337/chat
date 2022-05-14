import fastify from "fastify";
import cors from "@fastify/cors";

import test from "./routes/test";

const app = fastify();
app.register(cors, {
  origin: "*", // change later
});

// Routes
app.register(test, { prefix: "/test" });

app.listen(8080, "0.0.0.0");
