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

  return (
    <main style={{ height: "100vh", width: "100vw", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "1rem", backgroundImage: "url(https://w.wallhaven.cc/full/ex/wallhaven-ex9gwo.png)" }}>
      <div style={{ display: "flex", gap: "3rem" }}>
        {isAddEnabled ? (
          <button onClick={addMoveable} style={{ padding: "10px 30px", backgroundColor: "#0099cc", color: "#ffffff", border: "1px solid #333399", cursor: "pointer" }}>
            Add Moveable
          </button>
        ) : null}
        {moveableComponents.length != 0 ? (
          <button onClick={removeMovable} style={{ padding: "10px 30px", backgroundColor: "#0099cc", color: "#ffffff", border: "1px solid #333399", cursor: "pointer" }}>
            Remove Moveable
          </button>
        ) : null}
      </div>
      <div
        id="parent"
        style={{
          position: "relative",
          background: "black",
          height: "80vh",
          width: "80vw",
          borderRadius: "10px",
          overflow: "hidden",
        }}
        ref={parentContenedor}
      >
        {moveableComponents.map((item, index) => (
          <MovableItem {...item} parentContenedor={parentContenedor} key={index} updateMoveable={updateMoveable} setSelected={setSelected} isSelected={selected === item.id} />
        ))}
      </div>
    </main>
  );
};

export default App;
