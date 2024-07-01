import React from "react";
import Modal from "../../Modals/Modal";
import CheckInOption from "./DatesOption";
import CircularSlider from "./CircularSlider";
import { useSelector } from "react-redux";

const Month = ({ modalRef, handleInputField, monthRef }) => {
  const handleClick = (e) => {
    handleInputField(e.target, "month");
  };

  const curInput = useSelector((store) => store.form.curSelectInput);

  return (
    <Modal>
      <Modal.Open opens="month">
        <div
          className={`flex justify-center  items-center ${
            curInput === "month" ? "shadow-checkInShadow rounded-full" : ""
          } `}
          ref={monthRef}
        >
          <div
            className={`w-[17.3rem] h-[3.85rem] hover:before:content-[''] before:w-[17.3rem] before:absolute before:top-0 before:h-[3.85rem] before:left-[17.67rem] before:rounded-full  ${
              curInput === "month"
                ? "rounded-full bg-white"
                : "before:hover:bg-gray-300 "
            }  before:hover:opacity-40  flex items-center justify-center`}
            onClick={handleClick}
          >
            Month
          </div>
        </div>
      </Modal.Open>
      <Modal.Window modalRef={modalRef} name="month">
        <div className="flex flex-col justify-center items-center">
          <CheckInOption></CheckInOption>
          <CircularSlider></CircularSlider>
        </div>
      </Modal.Window>
    </Modal>
  );
};

export default Month;
