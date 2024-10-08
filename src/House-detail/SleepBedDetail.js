import React from "react";
import kitchen from "../data/Icons svg/kitchen.svg";
import car from "../data/Icons svg/car.svg";
import wifi from "../data/Icons svg/wifi.svg";
import tub from "../data/Icons svg/tub.svg";
import pets from "../data/Icons svg/pets.svg";
import tv from "../data/Icons svg/tv.svg";
import lift from "../data/Icons svg/Lift.svg";
import airConditioner from "../data/Icons svg/AC.svg";
import carbon from "../data/Icons svg/Carbon.svg";
import alarm from "../data/Icons svg/Alarm.svg";
import bed from "../data/Icons svg/bed.svg";
import Calendar from "../Header/Form/FormFields/Calendar";
import {
  setSelectedEndDate,
  setSelectedStartDate,
} from "../Header/Form/mainFormSlice";
import { useDispatch, useSelector } from "react-redux";
import { differenceInCalendarDays, format } from "date-fns";
import { useParams } from "react-router";

const SleepBedDetail = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const houseInfo = useSelector((store) => store.houseDetail.houseInfo[id]);
  const startDate = useSelector((store) => store.form.selectedStartDate);
  const endDate = useSelector((store) => store.form.selectedEndDate);
  let numOfNights = Math.abs(differenceInCalendarDays(startDate, endDate));

  let formatStartDate = startDate && format(new Date(startDate), "dd MMM yyyy");
  let formatEndDate = endDate && format(new Date(endDate), "dd MMM yyyy");

  function calendarTitle() {
    if (!startDate && !endDate) {
      return "Select check-In date";
    } else if (startDate && !endDate) {
      return "Select checkout date";
    } else {
      return `${numOfNights} nights in ${houseInfo?.city}`;
    }
  }

  const DateRange = ({ startDate, endDate }) => {
    return (
      <>
        <span className="text-sm text-gray-500 font-light">{startDate}</span>
        <span className="flex-center">-</span>
        <span className="text-sm text-gray-500 font-light">{endDate}</span>
      </>
    );
  };

  // Usage:

  return (
    <div className="w-full">
      <div className="w-full relative border-b border-grey-dim">
        <div className="py-12 w-full  flex justify-between flex-col">
          <h3 className="text-2xl leading-6 font-medium pb-6">
            Where you'll sleep
          </h3>
          {!houseInfo?.sleep_bed_1_link ? (
            <div className="border-[1px] max-w-56 w-full flex-center rounded-xl h-36">
              <div className=" w-44 justify-between flex flex-col h-24">
                <img src={bed} className="w-7 h-7" alt="" />
                <div className="flex flex-col">
                  <span className="text-lg font-medium">Bedroom 1</span>
                  <span className="text-sm font-light">1 double bed</span>
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                scrollSnapType: "x mandatory",
                scrollBehavior: "smooth",
              }}
              className="flex  gap-4 w-full overflow-x-auto min-w-5rem"
            >
              <div className=" w-80 shrink-0 flex justify-center flex-col ">
                <div className=" h-52 flex items-center justify-center w-full">
                  <img
                    style={{
                      scrollSnapAlign: "start",
                      flexShrink: 0,
                      scrollSnapStop: "always",
                    }}
                    className="rounded-xl object-cover  w-full h-full"
                    src={houseInfo?.sleep_bed_1_link}
                    alt=""
                  />
                </div>
                <div className="flex flex-col">
                  <span className="mt-4 font-medium">Bedroom 1</span>
                  <span className="text-sm font-light">1 double bed</span>
                </div>
              </div>
              {houseInfo?.sleep_bed_2_link && (
                <div className=" w-80 shrink-0 flex justify-center  flex-col ">
                  <div className=" flex h-52  items-center justify-center w-full">
                    <img
                      style={{
                        scrollSnapAlign: "start",
                        flexShrink: 0,
                        scrollSnapStop: "always",
                      }}
                      className="rounded-xl object-cover w-full h-full "
                      src={houseInfo?.sleep_bed_2_link}
                      alt=""
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="mt-4 font-medium">Bedroom 2</span>
                    <span className="text-sm font-light">1 queen bed</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div
        id="Amenities"
        className="py-12 scroll-mt-20  relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px]  after:bg-grey-dim"
      >
        <div className="h-full">
          <h3 className="text-2xl leading-6 font-medium pb-6">
            What this place offers
          </h3>
          <div className="flex flex-col 1smm:flex-row 1xz:flex-wrap ">
            <div className="w-1/2 pb-4 gap-4 flex">
              <img className="h-6 w-6" src={kitchen} alt="" />
              <span className="font-light">Kitchen</span>
            </div>
            <div className="w-1/2 pb-4 gap-4 flex">
              <img className="h-6 w-6" src={wifi} alt="" />
              <span className="font-light">wifi</span>
            </div>
            <div className="w-1/2 pb-4 gap-4 flex">
              <img className="h-6 w-6" src={car} alt="" />
              <span className="font-light">Free on-street parking</span>
            </div>
            <div className="w-1/2 pb-4 gap-4 flex">
              <img className="h-6 w-6" src={tub} alt="" />
              <span className="font-light">Private hot tub</span>
            </div>
            <div className="w-1/2 pb-4 gap-4 flex">
              <img className="h-6 w-6" src={pets} alt="" />
              <span className="font-light">Pets allowed</span>
            </div>
            <div className="w-1/2 pb-4 gap-4 flex">
              <img className="h-6 w-6" src={tv} alt="" />
              <span className="font-light text-nowrap">
                TV with standard cable/satellite
              </span>
            </div>
            <div className="w-1/2 pb-4 gap-4 flex">
              <img className="h-6 w-6" src={lift} alt="" />
              <span className="font-light">Lift</span>
            </div>
            <div id="airConditioner" className="w-1/2 pb-4 gap-4 flex">
              <img className="h-6 w-6" src={airConditioner} alt="" />
              <span className="font-light">Air conditioning</span>
            </div>
            <div className="w-1/2 pb-4 gap-4 flex">
              <img className="h-6 w-6" src={carbon} alt="" />
              <span className="font-light line-through">
                Carbon monoxide alarm
              </span>
            </div>
            <div className="w-1/2 pb-4 gap-4 flex">
              <img className="h-6 w-6" src={alarm} alt="" />
              <span className="font-light line-through">Smoke alarm</span>
            </div>
          </div>
        </div>
      </div>
      <div className="1xz:py-12 pt-12  ">
        <div className="flex flex-col">
          <h3 id="calendar" className="text-2xl leading-6 font-medium ">
            {calendarTitle()}
          </h3>
          <div className="h-9 flex pt-2  items-start">
            <div className="flex-center gap-1">
              {startDate && endDate ? (
                <DateRange
                  startDate={formatStartDate}
                  endDate={formatEndDate}
                ></DateRange>
              ) : (
                <span className="text-sm font-light text-grey">
                  {" "}
                  Add your travel dates for exact pricing
                </span>
              )}
            </div>
          </div>
          <div className="w-full flex  pt-4 justify-center items-center ">
            <Calendar></Calendar>
          </div>
          <div
            onClick={() => {
              dispatch(setSelectedStartDate(null));
              dispatch(setSelectedEndDate(null));
            }}
            className="w-full cursor-pointer flex items-center justify-end pr-4 "
          >
            <span className="underline text-sm font-medium">Clear dates</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SleepBedDetail;
