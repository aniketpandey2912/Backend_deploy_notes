const express = require("express");
const notesRouter = express.Router();
const { NoteModel } = require("../model/Note.model");

/**
 * @swagger
 * components:
 *  schemas:
 *    Note:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: The auto-generated id of the note
 *        title:
 *          type: string
 *          description: Title of the note
 *        desc:
 *          type: string
 *          description: description of the note
 *        userID:
 *          type: string
 *          description: The auto-generated user id
 */

/**
 * @swagger
 * tags:
 *  name: Notes
 *  description: All the APIs related to Notes
 */

/**
 * @swagger
 * /notes:
 *  get:
 *    summary: This will get all data from the database
 *    tags: [Notes]
 *    responses:
 *      200:
 *        description: A list of notes
 *      content:
 *        application/json:
 *          schema:
 *            type: array
 *            items:
 *              $ref: "#/components/schemas/Note"
 */

notesRouter.get("/", async (req, res) => {
  try {
    const notes = await NoteModel.find();
    res.send(notes);
  } catch (err) {
    res.send({ msg: "Something went wrong", error: err.message });
  }
});

/**
 * @swagger
 * /notes/create:
 *  post:
 *    summary: To create a note
 *    tags: [Notes]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/Note"
 *    responses:
 *      200:
 *        description: Note created successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Note"
 *      500:
 *        description: Server error
 */
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

/**
 * @swagger
 * /notes/update/{id}:
 *  patch:
 *    summary: To update a node
 *    tags: [Notes]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The note id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/Note"
 *    responses:
 *      200:
 *        description: The note details updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Note"
 *      404:
 *        description: The note doesn't exist
 *      500:
 *        description: Server error
 */

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

/**
 * @swagger
 * /notes/delete/{id}:
 *  patch:
 *    summary: To delete a node
 *    tags: [Notes]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The note id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/Note"
 *    responses:
 *      200:
 *        description: The note deleted successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Note"
 *      404:
 *        description: The note doesn't exist
 *      500:
 *        description: Server error
 */

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
