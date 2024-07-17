import styles from "./input.css";
import Header from "./Header/Header";
import Options from "./Main/Options";
import Toggle from "./Main/Toggle";
import House from "./Main/House";
import { useRef, useState } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { useSelector } from "react-redux";

export default function App() {
  const startScroll = useSelector((store) => store.app.startScroll);
  return (
    <div className="flex-center relative">
      <div
        className={` fixed  transition-all duration-[0.3s] ease-in-out ${
          !startScroll ? "h-[9.7rem]" : "h-[12rem]"
        } bg-white  w-full flex items-start justify-center top-0 `}
      >
        <Header></Header>
      </div>

      <div
        className={`  transition-all duration-[0.3s] ease-in-out flex-center  fixed   w-full z-10 bg-white  ${
          !startScroll ? "-translate-y-[5.9rem] shadow-md" : ""
        }   top-[10.6rem] flex-center  `}
      >
        <Options></Options>
      </div>

      <div className="mt-[12rem]   flex justify-center items-center ">
        <House></House>
      </div>

      <SpeedInsights></SpeedInsights>
    </div>
  );
}
