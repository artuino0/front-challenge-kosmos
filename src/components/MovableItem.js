import { useRef, useState } from "react";
import Moveable from "react-moveable";

const MovableItem = ({ updateMoveable, top, left, width, height, index, color, id, image, setSelected, isSelected = false }) => {
  // eslint-disable-next-line no-undef
  const targetRef = useRef();

  // eslint-disable-next-line no-undef
  const [nodoReferencia, setNodoReferencia] = useState({
    top,
    left,
    width,
    height,
    index,
    color,
    id,
    image,
  });

  let parent = document.getElementById("parent");
  let parentBounds = parent?.getBoundingClientRect();

  const onResize = async (e) => {
    // ACTUALIZAR ALTO Y ANCHO
    let newWidth = e.width;
    let newHeight = e.height;

    const positionMaxTop = top + e.drag.beforeTranslate[1] + newHeight;
    const positionMaxLeft = left + e.drag.beforeTranslate[0] + newWidth;

    if (positionMaxTop > parentBounds?.height) newHeight = parentBounds?.height - top;
    if (positionMaxLeft > parentBounds?.width) newWidth = parentBounds?.width - left;

    updateMoveable(id, {
      top,
      left,
      width: newWidth,
      height: newHeight,
      color,
      image,
    });

    // ACTUALIZAR NODO REFERENCIA
    const beforeTranslate = e.drag.beforeTranslate;

    targetRef.current.style.width = `${e.width}px`;
    targetRef.current.style.height = `${e.height}px`;

    let translateX = beforeTranslate[0];
    let translateY = beforeTranslate[1];
    targetRef.current.style.transform = `translate(${translateX}px, ${translateY}px)`;
    setNodoReferencia({
      ...nodoReferencia,
      translateX,
      translateY,
      top: top + translateY < 0 ? 0 : top + translateY,
      left: left + translateX < 0 ? 0 : left + translateX,
    });
  };

  const onResizeEnd = async (e) => {
    updateMoveable(
      id,
      {
        top: top,
        left: left,
        width: width,
        height: height,
        color,
        image,
      },
      true
    );
  };

  const onDragEnd = (e) => {};

  return (
    <>
      <div
        ref={targetRef}
        className="draggable"
        id={"component-" + id}
        style={{
          position: "absolute",
          top: top,
          left: left,
          width: width,
          height: height,
          background: color,
          zIndex: isSelected ? 1 : "auto",
        }}
        onClick={() => setSelected(id)}
      >
        {image && <img src={image} alt="Component" style={{ width: "100%", height: "100%" }} />}
      </div>
      <Moveable
        target={isSelected && targetRef.current}
        resizable
        draggable
        onDrag={(e) => {
          updateMoveable(id, {
            top: e.top,
            left: e.left,
            width,
            height,
            color,
            image,
          });
        }}
        onResize={onResize}
        onResizeEnd={onResizeEnd}
        keepRatio={false}
        throttleResize={1}
        renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
        edge={false}
        zoom={1}
        origin={false}
        padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
        snappable={true}
        bounds={{ left: 0, top: 0, right: 0, bottom: 0, position: "css" }}
      />
    </>
  );
};

export default MovableItem;
