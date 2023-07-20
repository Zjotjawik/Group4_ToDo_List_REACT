import React, { useState, useEffect } from "react";
import "./App.css";
import TrashcanIcon from "./components/TrashcanIcon";
import PenIcon from "./components/PenIcon";
import UncheckedIcon from "./components/UncheckedIcon";
import CheckedIcon from "./components/CheckedIcon";

function App() {
  // State Hook - `useState`
  const [isIconClicked, setIsIconClicked] = useState(false);
  const [textDeco, setTextDeco] = useState("");

  const [newItem, setNewItem] = useState("");
  const [items, setItems] = useState([]);

  const [showEdit, setShowEdit] = useState(-1);
  const [updatedText, setUpdatedText] = useState("");

  // Helper Functions
  function changeIcon (e) {
    setIsIconClicked(!isIconClicked);
    if(textDeco ===  "") {
      setTextDeco("line-through");
    }
    else {
      setTextDeco("");
    }

  }

  /* Adds a new item to the list array*/
  function addItem() {
    // ! Check for empty item
    if (newItem == "") {
      alert("You need to write something.");
      return;
    }

    // CREATE A PAYLOAD
    const item = {
      id: Math.floor(Math.random() * 1000),
      value: newItem,
      done: false
    };

    const payload = [...items, item]

    // Add new item to items array
    setItems(payload);

    // STORE IN LOCALHOST
    localStorageFunk(payload)

    // Reset newItem back to original state
    setNewItem("");
  }

  /* Deletes an item based on the `item.id` key */
  function deleteItem(id) {
    const newArray = items.filter((item) => item.id !== id);
    setItems(newArray);
    localStorageFunk(newArray)
  }

  /* Edit an item text after creating it. */
  function editItem(e, newText) {
    const id = Number(e.target.id)
    // Get the current item
    const currentItem = items.filter((item) => item.id === id);
    
    // Create a new item with same id
    const newItem = {
      id: currentItem.id,
      value: newText,
      done: currentItem.done
    };

    const newItems = items.filter((item) => item.id !== id);
    const payload = [...newItems, newItem]

    // Replace item in the item list
    setItems(payload);
    localStorageFunk(payload)
    setUpdatedText("");
    setShowEdit(-1);
  }

  /* Edit STATUS. */
  const editSatusItem = (id) => {
    let payload = items.map((todo) => {
      if (todo.id === id) {
        return { ...todo, done: !todo.done };
      } else {
        return { ...todo };
      }
    })
    console.log(payload);
    setItems(payload);
    localStorageFunk(payload);
  };

    // Local Storage
    const localStorageFunk = (payload) => localStorage.setItem('items', JSON.stringify(payload));
  
    useEffect(() => {
      const items = JSON.parse(localStorage.getItem('items')) ?? [];
      setItems(items);
    }, []);


  // Main part of app
  return (
    <div className="app">
      {/* 1. Header  */}
      <h1>My Todo List</h1>

      {/* 2. Add new item (input) */}
      <input
        type="text"
        placeholder="Add an item..."
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
      />

      {/* Add (button) */}
      <button className="add-button" onClick={addItem}>Add</button>

      {/* 3. List of todos (unordered list) */}
      <ul className="tasklist-container">
        {items.map((item) => {
          return (
            <div>
              <li key={item.id} style={{ textDecoration: textDeco }}> 
                {item.value}
                <div className="icon-container">
                  <button id={item.id} className="button-icon" onClick={()=>{editSatusItem(item.id)}}>
                 {item.done ? <CheckedIcon /> : <UncheckedIcon />} 
                  </button>
                  <button
                    className="button-icon"
                    onClick={() => deleteItem(item.id)}
                  >
                    <TrashcanIcon />
                  </button>
                  <button onClick={() => setShowEdit(item.id)}
                    className="button-icon">
                    <PenIcon />
                  </button>
                </div>
              </li>

              {showEdit === item.id ? (
                <div>
                  <input
                    type="text"
                    placeholder="edit item"
                    onChange={(e) => setUpdatedText(e.target.value)}
                  />
                  <button id={item.id} className="update-button" onClick={(e)=>{editItem(e, updatedText)}}>
                    Update
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}
      </ul>
    </div>
  );


}

export default App;