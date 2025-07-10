import React, { useState } from "react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you could add logic to send the form data to a backend or email service
  };

  return (
    <main className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-4 text-center">Share a Bathroom/Review</h1>
      <p className="mb-6 text-center">
        Help us improve Where2Go by submitting new restrooms or sharing your experience at existing locations.
      </p>
      {submitted ? (
        <div className="text-green-600 text-center font-semibold">
          Thank you for your submission!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-medium mb-1">Your Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="Your Name"
              className="w-full p-3 rounded-md border border-gray-300"
            />
          </div>
          <div>
            <label htmlFor="email" className="block font-medium mb-1">Your Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="Your Email"
              className="w-full p-3 rounded-md border border-gray-300"
            />
          </div>
          <div>
            <label htmlFor="location" className="block font-medium mb-1">Bathroom Location/Address:</label>
            <input
              type="text"
              id="location"
              name="location"
              required
              placeholder="Ex: 123 Main St, New York, NY"
              className="w-full p-3 rounded-md border border-gray-300"
            />
          </div>
          <div>
            <label htmlFor="message" className="block font-medium mb-1">Your Review or Information:</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              required
              placeholder="Please leave us a review at any existing locations or share a bathroom location you'd like for us to add!"
              className="w-full p-3 rounded-md border border-gray-300"
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-[#72b8f0] hover:bg-[#5ba7e4] text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition-colors duration-200 finder-button"
          >
            Submit
          </button>
        </form>
      )}
    </main>
  );
}