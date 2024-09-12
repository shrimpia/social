import { Note } from "../models/note";

export type NoteCreatedEvent = {
    type: 'noteCreated';
    note: Note;
};

export type NoteDeletedEvent = {
    type: 'noteDeleted';
    noteId: string;
};

export type Event =
    | NoteCreatedEvent
    | NoteDeletedEvent;
