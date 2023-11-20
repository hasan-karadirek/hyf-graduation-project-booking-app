import React, { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch.js";
import "./CSS/roomInfoCard.css";
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";
import { Button, Container } from "react-bootstrap";
import RoomDetailsCard from "../components/RoomDetailsCard";
import "chart.js/auto";
import { Link, useLocation } from "react-router-dom";
import AddRoomToBookingButton from "../components/AddRoomToBookingButton";
import RoomFilterCheckBoxes from "./RoomFilterCheckBoxes.jsx";
import BookingCart from "./BookingCart.jsx";

function RoomInfoCard() {
  const [response, setResponse] = useState(null);
  const [isPopupVisible, setPopupVisible] = useState({
    visible: false,
    roomId: null,
  });
  const [roomIdx, setRoomIdx] = useState({});

  const [filters, setFilters] = useState({
    roomType: null,
    facilities: null,
    bedCount: null,
  });
  // const [adults, setAdults] = useState(2);
  // const [children, setChildren] = useState(0);

  const queryParams = new URLSearchParams(useLocation().search);

  let checkIn = queryParams.get("checkIn");
  let checkOut = queryParams.get("checkOut");
  let adultsFromURL = queryParams.get("adults");
  let childrenFromURL = queryParams.get("children");

  adultsFromURL = adultsFromURL ? parseInt(adultsFromURL, 10) : 2;
  childrenFromURL = childrenFromURL ? parseInt(childrenFromURL, 10) : 0;

  checkIn = new Date(checkIn).toString();
  checkOut = new Date(checkOut).toString();

  const { isLoading, error, performFetch, cancelFetch } = useFetch(
    `/rooms?checkIn=${checkIn}&checkOut=${checkOut}&roomType=${
      filters.roomType ? filters.roomType : ""
    }&facilities=${filters.facilities ? filters.facilities : ""}&bedCount=${
      filters.bedCount ? filters.bedCount : ""
    }`,
    (response) => {
      setResponse(response);

      const initialIdx = {};
      response.rooms.forEach((room) => {
        initialIdx[room.exampleRoom._id] = 0;
      });
      setRoomIdx(initialIdx);
    }
  );

  useEffect(() => {
    // setAdults(adultsFromURL);
    // setChildren(childrenFromURL);
    performFetch({
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    });

    return () => cancelFetch();
  }, [filters, adultsFromURL, childrenFromURL]);

  const nextSlide = (imageLength, roomId) => {
    setRoomIdx((prevRoomIdx) => ({
      ...prevRoomIdx,
      [roomId]: (prevRoomIdx[roomId] + 1) % imageLength,
    }));
  };

  const prevSlide = (imageLength, roomId) => {
    setRoomIdx((prevRoomIdx) => ({
      ...prevRoomIdx,
      [roomId]: (prevRoomIdx[roomId] - 1 + imageLength) % imageLength,
    }));
  };

  return (
    <>
      <BookingCart />
      <Container>
        <br />
        <br />
        <br />
        <Button as={Link} to={"/checkout"}>
          Checkout
        </Button>
        <RoomFilterCheckBoxes setFilters={setFilters} />

        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : response && response.rooms && response.rooms.length > 0 ? (
          response.rooms.map((room, index) => (
            <div key={index} className="block-02">
              <div className="carousel-02">
                <BsArrowLeftCircleFill
                  className="arrow-02 arrow-left-02"
                  onClick={() =>
                    prevSlide(
                      room.exampleRoom && room.exampleRoom.images
                        ? room.exampleRoom.images.length
                        : 0,
                      room.exampleRoom._id
                    )
                  }
                />
                <div className="div-slider-02-02">
                  <img
                    className="img-slider-02"
                    src={
                      room.exampleRoom && room.exampleRoom.images
                        ? room.exampleRoom.images[
                            roomIdx[room.exampleRoom._id] || 0
                          ]
                        : ""
                    }
                    alt={room.roomType}
                  />
                </div>
                <BsArrowRightCircleFill
                  className="arrow-02 arrow-right-02"
                  onClick={() =>
                    nextSlide(
                      room.exampleRoom && room.exampleRoom.images
                        ? room.exampleRoom.images.length
                        : 0,
                      room.exampleRoom._id
                    )
                  }
                />
              </div>

              <div className="info-02">
                <div className="info-02-02">
                  <ul className="u-list-02">
                    <li>Count:{room.count}</li>
                    <li>Room Type: {room.exampleRoom.roomType}</li>
                    <li>
                      Room Description: {room.exampleRoom.roomDescription}
                    </li>
                    <li>Bed Count: {room.exampleRoom.bedCount}</li>
                    <li>Price: {room.exampleRoom.roomPrice.$numberDecimal}</li>
                    <li>Facilities:</li>
                    <ul className="u-list-02">
                      {room.exampleRoom.facilities.map((facility, idx) => (
                        <li key={facility + idx}>{facility}</li>
                      ))}
                    </ul>
                  </ul>
                </div>

                <div className="buttons-02">
                  <button
                    className="button-02"
                    onClick={() => {
                      setPopupVisible({
                        visible: !isPopupVisible.visible,
                        roomId: room.exampleRoom._id,
                      });
                    }}
                  >
                    Information
                  </button>
                  <AddRoomToBookingButton
                    checkIn={checkIn}
                    checkOut={checkOut}
                    roomId={room.exampleRoom._id}
                    className="button-02"
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>
            No available rooms on that date.
            <br />
            please choose another date.
          </p>
        )}
        {isPopupVisible.visible && (
          <div className="popup-container-02">
            <div className="popup-content-02">
              <button
                className="button-x-02"
                onClick={() => setPopupVisible(false)}
              >
                X
              </button>
              <RoomDetailsCard
                checkIn={checkIn}
                checkOut={checkOut}
                roomId={isPopupVisible.roomId}
              />
            </div>
          </div>
        )}
      </Container>
    </>
  );
}

export default RoomInfoCard;
