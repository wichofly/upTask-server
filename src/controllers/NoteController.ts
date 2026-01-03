import type { Request, Response } from 'express';
import Note, { INote } from '../models/Note';
import { Types } from 'mongoose';

type NoteParams = {
  noteId: Types.ObjectId;
};

export class NoteController {
  // INote is the request body type inside of the generic of Request, which includes content as a string.
  static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
    const { content } = req.body;

    const note = new Note();
    note.content = content;
    note.createdBy = req.user.id;
    note.task = req.task.id;

    req.task.notes.push(note.id); // Add the note's ObjectId to the task's notes array in TaskSchema

    try {
      await Promise.allSettled([req.task.save(), note.save()]);
      res.send('Note created successfully');
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

  static getTaskNotes = async (req: Request, res: Response) => {
    try {
      const notes = await Note.find({ task: req.task.id });
      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

  static deleteNote = async (req: Request<NoteParams>, res: Response) => {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);

    if (!note) return res.status(404).json({ error: 'Note not found' });

    // Check if the user deleting the note is the one who created it
    if (note.createdBy.toString() !== req.user.id.toString())
      return res.status(401).json({ error: 'Unauthorized' });

    // Remove the note's ObjectId from the task's notes array in TaskSchema
    req.task.notes = req.task.notes.filter(
      (noteId) => noteId.toString() !== note.id.toString()
    );

    try {
      await Promise.allSettled([req.task.save(), note.deleteOne()]);
      res.send('Note deleted successfully');
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };
}
