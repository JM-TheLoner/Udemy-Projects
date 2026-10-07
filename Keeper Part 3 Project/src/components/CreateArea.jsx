import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Fab, Zoom } from "@mui/material";

function CreateArea(props) {
  const [selected, setSelected] = useState(false);
  const [num, setnum] = useState(1);

  function click() {
    setSelected(true);
    setnum(3);
  }

  const [text, setText] = useState({
    id: "",
    title: "",
    content: "",
  });
  const id = props.notes;

  const newid = id.length;

  function changer(event) {
    const { name, value } = event.target;
    setText((prev) => {
      return {
        ...prev,
        id: newid,
        [name]: value,
      };
    });
  }

  return (
    <div>
      <form className="create-note">
        {selected && (
          <input
            onChange={changer}
            name="title"
            placeholder="Title"
            value={text.title}
          />
        )}

        <textarea
          onClick={click}
          onChange={changer}
          name="content"
          placeholder="Take a note..."
          rows={num}
          value={text.content}
        />

        <Zoom in={selected}>
          <Fab
            onClick={(event) => {
              props.added(text);
              setText({
                id: "",
                title: "",
                content: "",
              });
              event.preventDefault();
              setSelected(false);
              setnum(1);
            }}
          >
            <AddIcon />
          </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;
