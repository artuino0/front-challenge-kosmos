import React, { useEffect, useState, createRef } from "react";
import MovableItem from "./components/MovableItem";

const App = () => {
  const [moveableComponents, setMoveableComponents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [photos, setPhotos] = useState();
  const [isAddEnabled, setIsAddEnabled] = useState(false);

  const parentContenedor = createRef();

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/photos")
      .then((response) => response.json())
      .then((data) => {
        setPhotos(data);
      })
      .finally(() => {
        setIsAddEnabled(true);
      });
  }, []);

  const addMoveable = () => {
    // Create a new moveable component and add it to the array
    const COLORS = ["red", "blue", "yellow", "green", "purple"];

    setMoveableComponents([
      ...moveableComponents,
      {
        id: Math.floor(Math.random() * Date.now()),
        top: 0,
        left: 0,
        width: 100,
        height: 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        updateEnd: true,
        image: photos[Math.floor(Math.random() * photos.length)].url,
      },
    ]);
  };

  const removeMovable = () => {
    const updatedMoveables = moveableComponents.filter((component) => component.id !== selected);
    setMoveableComponents(updatedMoveables);
  };

  const updateMoveable = (id, newComponent, updateEnd = false) => {
    const updatedMoveables = moveableComponents.map((moveable, i) => {
      if (moveable.id === id) {
        return { id, ...newComponent, updateEnd };
      }
      return moveable;
    });
    setMoveableComponents(updatedMoveables);
  };

  const handleResizeStart = (index, e) => {
    console.log("e", e.direction);
    // Check if the resize is coming from the left handle
    const [handlePosX, handlePosY] = e.direction;
    // 0 => center
    // -1 => top or left
    // 1 => bottom or right

    // -1, -1
    // -1, 0
    // -1, 1
    if (handlePosX === -1) {
      console.log("width", moveableComponents, e);
      // Save the initial left and width values of the moveable component
      const initialLeft = e.left;
      const initialWidth = e.width;

      // Set up the onResize event handler to update the left value based on the change in width
    }
  };

  return (
    <main style={{ height: "100vh", width: "100vw" }}>
      {isAddEnabled ? <button onClick={addMoveable}>Add Moveable1</button> : null}
      {moveableComponents.length != 0 ? <button onClick={removeMovable}>Remove Moveable</button> : null}
      <div
        id="parent"
        style={{
          position: "relative",
          background: "black",
          height: "80vh",
          width: "80vw",
        }}
        ref={parentContenedor}
      >
        {moveableComponents.map((item, index) => (
          <MovableItem {...item} parentContenedor={parentContenedor} key={index} updateMoveable={updateMoveable} handleResizeStart={handleResizeStart} setSelected={setSelected} isSelected={selected === item.id} />
        ))}
      </div>
    </main>
  );
};

export default App;
