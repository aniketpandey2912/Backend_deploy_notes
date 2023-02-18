const express = require("express");
const notesRouter = express.Router();
const { NoteModel } = require("../model/Note.model");

notesRouter.get("/", async (req, res) => {
  try {
    const notes = await NoteModel.find();
    res.send(notes);
  } catch (err) {
    res.send({ msg: "Something went wrong", error: err.message });
  }
});

notesRouter.post("/create", async (req, res) => {
  let noteDetails = req.body;
  try {
    let newNote = new NoteModel(noteDetails);
    await newNote.save();
    res.send({ msg: "Note created successfully" });
  } catch (err) {
    res.send({ msg: "Something went wrong", error: err.message });
  }
});

notesRouter.patch("/update/:id", async (req, res) => {
  const updates = req.body;
  const ID = req.params.id;
  const note = await NoteModel.findOne({ _id: ID });
  const userID_in_note = note.userID;
  const userID_in_req = req.body.userID;
  try {
    if (userID_in_note !== userID_in_req) {
      res.send({ msg: "You are not authorised" });
    } else {
      await NoteModel.findByIdAndUpdate({ _id: ID }, updates);
      res.send({ msg: "Note updated successfully" });
    }
  } catch (err) {
    res.send({ msg: "Something went wrong", error: err.message });
  }
});

notesRouter.delete("/delete/:id", async (req, res) => {
  const ID = req.params.id;
  const note = await NoteModel.findOne({ _id: ID });
  const userID_in_note = note.userID;
  const userID_in_req = req.body.userID;
  try {
    if (userID_in_note !== userID_in_req) {
      res.send({ msg: "You are not authorised" });
    } else {
      await NoteModel.findByIdAndDelete({ _id: ID });
      res.send({ msg: "Note Deleted successfully" });
    }
  } catch (err) {
    res.send({ msg: "Something went wrong", error: err.message });
  }
});

module.exports = { notesRouter };
