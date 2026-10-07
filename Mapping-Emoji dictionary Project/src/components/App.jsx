import React from "react";
import Emoji from "./Emoji";
import emojipedia from "../emojipedia";

function App() {
  return (
    <div>
      <h1>
        <span>emojipedia</span>
      </h1>

      <dl className="dictionary">
        {emojipedia.map(function (emoji) {
          return (
            <Emoji
              key={emoji.id}
              emoji={emoji.emoji}
              name={emoji.name}
              meaning={emoji.meaning}
            />
          );
        })}
      </dl>
    </div>
  );
}

export default App;
