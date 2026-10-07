import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

function App() {
  const [notes, setNotes] = useState([]);

  function addNote(input) {
    setNotes((prevNotes) => {
      return [...prevNotes, input];
    });
  }
  function delNote(id) {
    console.log(id);
    setNotes((prevNotes) => {
      return prevNotes.filter((note, index) => {
        return id !== index;
      });
    });
  }

  return (
    <div>
      <Header />
      <CreateArea added={addNote} notes={notes} />
      {notes.map((note) => {
        return (
          <Note
            key={note.id}
            id={note.id}
            title={note.title}
            content={note.content}
            deleted={delNote}
          />
        );
      })}

      <Footer />
    </div>
  );
}

export default App;
