import React, {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { useSelector, useDispatch } from "react-redux";
import { createPortal } from "react-dom";
import { setActiveInput } from "../Header/Form/mainFormSlice";

const modalContext = createContext();

let modalStye = {
  checkIn: "top-[30%]",
  destination: "top-[20%]",
  checkOut: "top-[60%]",
  guest: "top-[50%]",
};
function Modal({ children }) {
  const [openName, setOpenName] = useState("");

  const close = () => setOpenName("");
  const open = setOpenName;

  const searchInput = useSelector((store) => store.form.search);

  useEffect(() => {
    if (!searchInput) close();
  }, [searchInput]);

  return (
    <modalContext.Provider value={{ openName, close, open }}>
      {children}
    </modalContext.Provider>
  );
}

function Open({ children, opens: opensWindowName }) {
  const { open } = useContext(modalContext);

  return cloneElement(children, { onClick: () => open(opensWindowName) });
}

function Window({ children, name }) {
  const { openName, close } = useContext(modalContext);
  const data = useSelector((store) => store.form.curSelectInput);

  const ref = useRef();
  const dispatch = useDispatch();

  useEffect(
    function () {
      function handleClick(e) {
        if (ref?.current && !ref.current?.contains(e.target)) {
          close();
          dispatch(setActiveInput(""));
        }
      }

      document.addEventListener("click", handleClick, true);

      return () => document.removeEventListener("click", handleClick, true);
    },
    [close]
  );

  if (name !== openName) return null;

  return createPortal(
    <div
      className={`fixed ${modalStye[data]} left-[22%] h-[25rem] w-[26rem] bg-black bg-opacity-50 rounded-[2rem] `}
      ref={ref}
    >
      <div>{cloneElement(children)}</div>
    </div>,
    document.body
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
