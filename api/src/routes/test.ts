async function Get(req, res) {
  console.log(req.body);
  res.send("Hello, World!");
}

export default function test(fastify, _, done) {
  fastify.get("/", Get);

  done();
}
