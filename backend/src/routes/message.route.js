import express from "express"; // import express

const router = express.Router(); // create router instance, named router

router.get("/send", (req, res) => {
  res.send("Send message endpoint"); // when GET req is made send / respond with "Send message endpoint"
});

export default router; // so we can use this router in other files, like server.js
