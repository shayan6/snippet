const router = require("express").Router();
const snippet = require("../models/snippetModel");
const auth = require("../middleware/auth");

router.post("/", async (req, res) => {
  try {
    
    const { title, description, code } = req.body;
    
    if (!description && !code) {
      return res.status(400).json({ status: false, message: "You must enter at least description or code." })
    }

    const newSnippet = new snippet({
      title, description, code
    });

    const savedSinppet = await newSnippet.save();

    res.json(savedSinppet);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const getSnippet = await snippet.find();
    const token = req.cookies.token;
    console.log(token);
    res.json(getSnippet);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description, code } = req.body;
    console.log(id);
    
    if (!description && !code) {
      return res.status(400).json({ status: false, message: "You must enter at least description or code." })
    }

    if (!id) {
      return res.status(400).json({ status: false, message: "Id is not given." })
    }

    let existingSnippet = await snippet.findById(id);
    if (!existingSnippet) {
      return res.status(400).json({ status: false, message: "Id is not found." })
    }

    existingSnippet.title = title;
    existingSnippet.description = description;
    existingSnippet.code = code;

    const savedSinppet = await existingSnippet.save();
    res.json(savedSinppet);

  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    
    if (!id) {
      return res.status(400).json({ status: false, message: "Id is not given." })
    }

    const existingSnippet = await snippet.findById(id);
    if (!existingSnippet) {
      return res.status(400).json({ status: false, message: "Id is not found." })
    }

    await snippet.delete();
    res.json(existingSnippet);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

module.exports = router;
