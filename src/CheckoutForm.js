import React, { useState, useEffect, useRef } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import icon from "./data/airbnbLogo.svg";
import arrowLeft from "./data/Icons svg/arrow-left.svg";
import star from "./data/Icons svg/star.svg";
import card from "./data/Icons svg/card.svg";
import supabase from "./Services/Supabase";
import CustomCardElement from "./CustomCardElement";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import {
  booking,
  bookRoom,
  getBooking,
  getRoomInfo,
  updateBooking,
} from "./Services/apiRooms";
import { differenceInDays, format } from "date-fns";
import CalendarModal from "./Header/Form/CalendarModal";
import Calendar from "./Header/Form/FormFields/Calendar";
import { setCalendarModalOpen } from "./Header/Form/mainFormSlice";
import Footer from "./Footer";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [processing, setProcessing] = useState(false);
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const dispatch = useDispatch();
  const endDate = useSelector((store) => store.form.selectedEndDate);
  const startDate = useSelector((store) => store.form.selectedStartDate);

  const guestPlural = useSelector((store) => store.form.guestPlural);
  const petPlural = useSelector((store) => store.form.petPlural);

  const adultCount = useSelector((store) => store.form.adultCount);
  const childCount = useSelector((store) => store.form.childCount);
  const infantCount = useSelector((store) => store.form.infantCount);
  const petCount = useSelector((store) => store.form.petsCount);
  const isModalOpen = useSelector((store) => store.form.isCalendarModalOpen);

  const userData = useSelector((store) => store.app.userData);

  const handleEditClick = () => {
    dispatch(setCalendarModalOpen(true));
  };

  let updateBookingData;

  const handleCloseModal = () => {
    dispatch(setCalendarModalOpen(false));
    updateDates();

    updateBookingData = {
      startDate: formatStartDate?.current,
      endDate: formattedEndDate?.current,
      numOfDays: Math.abs(numOfDays?.current),
      userEmail: userData?.email,
      roomId: id,
    };

    if (allBookingDataTruthy(updateBookingData)) {
      updateUserBooking();
    }
  };

  let formattedEndDate = useRef();
  let formatStartDate = useRef();
  let numOfDays = useRef();

  function updateDates() {
    if (startDate && endDate) {
      numOfDays.current = differenceInDays(startDate, endDate);
      if (endDate) {
        formattedEndDate.current = format(endDate, "d MMM");
      }
      if (startDate) {
        formatStartDate.current = format(startDate, "dd");
      }
    }
  }

  const {
    data: updateData,
    isLoading: updateLoading,
    refetch: updateUserBooking,
    isError: updateError,
  } = useQuery({
    queryFn: () => updateBooking(updateBookingData),
    queryKey: ["updateBookingData"],
    enabled: false,
  });

  let bookingData;

  function updateBookingDataFn() {
    bookingData = {
      startDate: formatStartDate?.current,
      endDate: formattedEndDate?.current,
      numOfDays: Math.abs(numOfDays?.current),
      status: "pending",
      user_email: userData?.email,
      room_id: id,
    };

    updateBookingData = {
      startDate: formatStartDate?.current,
      endDate: formattedEndDate?.current,
      numOfDays: Math.abs(numOfDays?.current),
      userEmail: userData?.email,
      roomId: id,
    };

    if (userBookingData) {
      if (allBookingDataTruthy(updateBookingData)) {
        updateUserBooking();
      }
    } else {
      if (allBookingDataTruthy(bookingData)) {
        insertBooking();
      }
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    updateDates();
    updateBookingDataFn();
  }, []);

  const allBookingDataTruthy = (data) => {
    return Object.values(data).every((value) => Boolean(value));
  };

  const {
    refetch: insertBooking,

    isLoading: bookingLoading,
    isError: bookingError,
  } = useQuery({
    queryFn: () => booking(bookingData),
    queryKey: ["booking"],
    enabled: false,
  });

  const { data: userBookingData } = useQuery({
    queryFn: () => getBooking(userData?.email, id),
    queryKey: ["bookingInfo", id],
    enabled: !!userData?.email && !!id,
  });

  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["roomInfo", id],
    queryFn: () => getRoomInfo(id),
    enabled: !!id,
  });

  // State for customer details
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState({
    line1: "",
    city: "",
    state: "",
    postal_code: "",
    country: "IN", // Assuming default country is India
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements || !session) {
      setProcessing(false);
      return;
    }

    // Call Supabase function to create payment intent
    const response = await fetch(
      "https://xailnuaqpfvjojptkpgh.supabase.co/functions/v1/create-payment-intent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          amount: 1000, // Amount in cents
          customerName,
          customerAddress,
        }),
      }
    );

    const data = await response.json();

    if (response.status !== 200) {
      setError(data.error);
      setProcessing(false);
      return;
    }

    const { clientSecret } = data;

    // Confirm the payment with Stripe
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      // Payment failed
      setError(result.error.message);
    } else {
      // Payment succeeded
      if (result.paymentIntent.status === "succeeded") {
        // Update the database or perform any post-payment actions

        bookRoom({
          amount: 1000,
          status: "succeeded",
          stripe_payment_intent_id: result.paymentIntent.id,
        });

        // Show success message in the UI
        setSuccess("Payment successful!");
      } else {
        setError("Payment failed. Please try again.");
      }
    }

    setProcessing(false);
  };

  let load = updateLoading || bookingLoading;

  return (
    <div>
      {load && (
        <div className=" w-screen z-50 h-screen bg-white opacity-80  fixed flex-center">
          <div className="cssLoader  absolute top-1/2 left-1/2  w-12 h-3"></div>
        </div>
      )}
      <header>
        <div className="pl-6 border-b border-shadow-gray ">
          <div className="w-8 ">
            <a href="/">
              <div className="flex h-20 items-center">
                <img
                  className="mr-2  h-34 scale-[1.2] "
                  src={icon}
                  alt="like"
                />
                <h1 className="text-2xl  leading-8   text-pink text-start font-semibold">
                  airbnb
                </h1>
              </div>
            </a>
          </div>
        </div>
      </header>
      <main>
        <div className="w-full px-20 h-[9.25rem] px-auto">
          <div className="mx-20 relative pb-8">
            <span className="pt-16 block  text-[2rem] font-medium pb-4">
              Request to book
            </span>
            <button
              onClick={() => navigate(-1)}
              className="absolute -left-14 hover:bg-shadow-gray-light h-12 w-12 flex-center rounded-full top-16"
            >
              <img className="h-4 w-4" src={arrowLeft} alt="" />
            </button>
          </div>
        </div>

        <div className="w-[calc(100%-10rem)] flex px-20  mx-auto">
          <section className="w-1/2 ">
            <span className="text-2xl block font-medium pb-6">Your trip</span>
            <div className="pb-6  flex justify-between">
              <div className="flex flex-col">
                <span className="mt-2 block">Dates</span>
                <span className="">
                  {formatStartDate.current ||
                    userBookingData?.booking?.startDate}{" "}
                  -{" "}
                  {formattedEndDate.current ||
                    userBookingData?.booking?.endDate}
                </span>
              </div>
              <button
                onClick={() => handleEditClick()}
                className="font-medium underline"
              >
                Edit
              </button>
            </div>
            <div className="pb-6  flex justify-between">
              <div className="flex flex-col">
                <span className="mt-2 block">Guests</span>
                <span className="">
                  {adultCount + childCount > 0
                    ? `${adultCount + childCount} guest${guestPlural} ${
                        infantCount
                          ? `${infantCount} infant${
                              infantCount > 1 ? "s" : ""
                            }${petCount > 1 ? "," : ""}`
                          : ""
                      } ${petCount ? `${petCount} pet${petPlural}` : ""}`
                    : "1 guest"}
                </span>
              </div>
              <button className="font-medium underline">Edit</button>
            </div>
            <div className="mt-2">
              <div className="border-t border-grey-light-50 w-full"></div>
              <div className="pt-8 pb-6">
                <div>
                  <div className="">
                    <div className="flex mb-6 items-end justify-between">
                      <span className="text-2xl">Pay with</span>
                      <div className="flex space-x-1">
                        <img
                          className="w-8 h-3"
                          src="https://a0.muscache.com/airbnb/static/packages/assets/frontend/legacy-shared/svgs/payments/logo_visa.0adea522bb26bd90821a8fade4911913.svg"
                          alt=""
                        />
                        <img
                          className="w-8 h-3"
                          src="https://a0.muscache.com/airbnb/static/packages/assets/frontend/legacy-shared/svgs/payments/logo_mastercard.f18379cf1f27d22abd9e9cf44085d149.svg"
                          alt=""
                        />
                        <img
                          className="w-8 h-3"
                          src="https://a0.muscache.com/airbnb/static/packages/assets/frontend/legacy-shared/svgs/payments/logo_amex.84088b520ca1b3384cb71398095627da.svg"
                          alt=""
                        />
                        <img
                          className="w-8 h-3"
                          src="https://a0.muscache.com/airbnb/static/packages/assets/frontend/legacy-shared/svgs/payments/logo_rupay.f419bf8f3062eb6d2408393354129ba8.svg"
                          alt=""
                        />
                        <img
                          className="w-8 h-3"
                          src="https://a0.muscache.com/airbnb/static/packages/assets/frontend/legacy-shared/svgs/payments/logo_dinersclub.0e75154d53aa4800c036282b8e189999.svg"
                          alt=""
                        />
                      </div>
                    </div>
                    <div className="w-full border border-grey rounded-lg">
                      <div className="pt-4    pb-4 pl-4 pr-10">
                        <div className="flex h-6 items-center space-x-2">
                          <img src={card} className="h-8 w-10" alt="" />
                          <span className="font-light">
                            Credit or debit card
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full mt-4 border border-grey rounded-lg">
                      <CustomCardElement></CustomCardElement>
                    </div>
                    <label htmlFor="card-holder-name"></label>
                    <div className="w-full relative flex justify-center mt-4 border border-grey rounded-lg">
                      <span className="absolute left-3 top-2 text-xs font-light">
                        Cardholder name
                      </span>
                      <input
                        className="mx-3 mt-6 mb-2 w-full outline-none "
                        id="card-holder-name"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className=""></div>
                </div>
              </div>
            </div>
            <div className="mt-2 w-full">
              <span className="pt-8 border-t  border-grey-light-50  w-full block text-2xl font-medium pb-6">
                Required for your trip
              </span>
              <div className="mb-6 justify-between flex">
                <div className="flex flex-col">
                  <span className="">Write a message to the Host</span>
                  <span className="text-sm">
                    Before you continue, let Renata know a little about your
                    trip and why their place is a good fit.
                  </span>
                </div>
                <div className="">
                  <button
                    disabled
                    className="px-[15px] text-sm border-black py-[7px] border rounded-md"
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="mb-10 justify-between flex">
                <div className="flex flex-col">
                  <span className="font-bold">Profile photo</span>
                  <span className="text-sm">
                    Hosts want to know who’s staying at their place.
                  </span>
                </div>
                <div className="">
                  <button
                    disabled
                    className="px-[15px] text-sm border-black py-[7px] border rounded-md"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-2 border-t border-grey-light-50  w-full">
              <div className="pt-8  w-full pb-6">
                <span className="block  font-medium text-2xl mb-6">
                  Ground rules
                </span>
                <p className="mb-4 font-light">
                  We ask every guest to remember a few simple things about what
                  makes a great guest.
                </p>
                <ul className="custom-list">
                  <li className="">
                    <span className="font-light">Follow the house rules</span>
                  </li>
                  <li className="">
                    <span className="font-light">
                      Treat your Host’s home like your own
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="py-8 mt-2 border-t border-grey-light-50  w-full">
              <button className="bg-dark-pink  font-medium rounded-lg text-white w-56 h-14">
                Request to book
              </button>
            </div>
          </section>
          <section className="w-1/2 mb-32">
            <div className="ml-[5.83rem] sticky top-52 ">
              <div className="mb-[5.5rem]  p-6 border border-grey-light-50 rounded-lg">
                <div className="w-full  border-b border-grey-light-50 grid-cols-3 items-center grid-flow-col  pb-6 grid">
                  <div className="w-28 h-28">
                    <img
                      className="w-full object-cover rounded-xl h-full"
                      src={data?.images[0]}
                      alt=""
                    />
                  </div>
                  <div className="w-full justify-center flex space-y-1 flex-col">
                    <span className="block text-sm font-medium">
                      At{" "}
                      {data?.host_name
                        ? data?.host_name?.replace(/about/gi, "")
                        : "Carl's"}
                      's
                    </span>
                    <span className="text-sm font-light">
                      Entire guest suite
                    </span>
                    <div className="flex items-center space-x-1">
                      <img className="w-4 h-4" src={star} alt="" />
                      <span className="text-sm font-medium">
                        {data?.house_rating}
                      </span>
                      <span className="text-sm font-light">
                        ({data?.rating_count})
                      </span>
                    </div>
                  </div>
                </div>
                <div className="py-6">
                  <span className="block text-2xl font-medium">
                    Price details
                  </span>
                </div>
                <div>
                  <div className="flex pb-4 font-light justify-between items-center">
                    <span>
                      ${Math.ceil(data?.price / 83)} x{" "}
                      {Math.abs(
                        numOfDays.current || userBookingData?.booking?.numOfDays
                      )}{" "}
                      nights
                    </span>
                    <span>
                      $
                      {Math.ceil(
                        Math.ceil(data?.price / 83) *
                          Math.abs(
                            numOfDays.current ||
                              userBookingData?.booking?.numOfDays
                          )
                      )}
                    </span>
                  </div>
                  <div className="flex pb-4 justify-between font-light  items-center">
                    <span>Cleaning fee</span>
                    <span>
                      ${Math.floor(Math.ceil(data?.price / 83) * 0.7)}
                    </span>
                  </div>
                  <div className="flex pb-4 justify-between   font-light items-center">
                    <span>Airbnb service fee</span>
                    <span>
                      $
                      {Math.floor(
                        0.11 *
                          Math.ceil(
                            Math.ceil(data?.price / 83) *
                              Math.abs(
                                numOfDays.current ||
                                  userBookingData?.booking?.numOfDays
                              )
                          )
                      )}
                    </span>
                  </div>
                  <div className="flex border-t border-grey-light-50 pt-4 justify-between font-light  items-center">
                    <span className="font-medium">Total (U.S. Dollar)</span>
                    <span className="font-medium">
                      $
                      {Math.ceil(
                        Math.ceil(data?.price / 83) *
                          Math.abs(
                            numOfDays.current ||
                              userBookingData?.booking?.numOfDays
                          )
                      ) +
                        Math.floor(Math.ceil(data?.price / 83) * 0.7) +
                        Math.floor(
                          0.11 *
                            Math.ceil(
                              Math.ceil(data?.price / 83) *
                                Math.abs(
                                  numOfDays.current ||
                                    userBookingData?.booking?.numOfDays
                                )
                            )
                        )}
                    </span>
                  </div>
                </div>
              </div>
              <CalendarModal isOpen={isModalOpen} onClose={handleCloseModal}>
                <div className="w-[41.31rem]">
                  <Calendar />
                </div>
              </CalendarModal>
            </div>
          </section>
        </div>
      </main>
      <div className="w-screen border-t border-grey-light-50 flex-center bg-shadow-gray-light h-16">
        <Footer></Footer>
      </div>
    </div>
  );
};

export default CheckoutForm;

/* 

<form onSubmit={handleSubmit}>
     
      <CardElement />
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <button type="submit" disabled={!stripe || processing || !session}>
        Pay
      </button>
    </form>

*/
