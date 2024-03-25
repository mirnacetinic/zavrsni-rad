'use client';
import React from 'react';

const Searchbar = () => {
  return (
    <div className="searchbar-container">
      <div className="searchbar rounded md:rounded-full">
        <div className="flex flex-col md:flex-row items-center justify-between px-4">
          <div className="mb-4 md:mr-2 md:mb-0 flex flex-col items-center w-full md:w-auto">
            <label htmlFor="whereTo" className="searchbar-label">
              Where to:
            </label>
            <input id="whereTo" type="text" placeholder="Enter destination" className="searchbar-input"/>
          </div>
          <div className="mb-4 md:mr-2 md:mb-0 flex flex-col items-center w-full md:w-auto">
            <label htmlFor="checkIn" className="searchbar-label">
              Check in:
            </label>
            <input id="checkIn" type="date" placeholder="Check in date" className="searchbar-input"/>
          </div>
          <div className="mb-4 md:mr-2 md:mb-0 flex flex-col items-center w-full md:w-auto">
            <label htmlFor="checkOut" className="searchbar-label">
              Check out:
            </label>
            <input id="checkOut" type="date" placeholder="Check out date" className="searchbar-input"/>
          </div>
          <div className="mb-4 md:mr-2 md:mb-0 flex flex-col items-center w-full md:w-auto">
            <label htmlFor="guests" className="searchbar-label">
              Guests:
            </label>
            <input id="guests" type="number" placeholder="Number of guests" className="searchbar-input"/>
          </div>
          <div className="text-center mt-4">
            <button className="searchbar-button">Search</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Searchbar;
