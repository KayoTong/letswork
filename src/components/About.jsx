import React from "react";

export default function About() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] flex items-center justify-center mb-8">
        <img
          src="https://www.parkcentralny.com/wp-content/uploads/2023/11/central_park_crop.jpg"
          alt="NYC street"
          className="absolute inset-0 w-full h-full object-cover brightness-70"
          draggable={false}
        />
        <div className="absolute inset-0 bg-teal-900 bg-opacity-30 flex flex-col items-center justify-center text-white text-center z-10">
          <h1 className="text-4xl font-bold mb-2">About Where2Go</h1>
          <p className="text-lg">your go to restroom finder for the city.</p>
        </div>
      </section>

      {/* About Content */}
      <section className="flex justify-center items-center mb-8">
        <div className="flex flex-col md:flex-row items-center gap-8 bg-white rounded-xl shadow-lg p-8 max-w-3xl w-full">
          <img
            src="https://www.iconarchive.com/download/i135668/microsoft/fluentui-emoji-mono/Toilet.1024.png"
            alt="Restroom sign"
            className="w-40 h-40 object-cover shadow-md rounded-lg"
            draggable={false}
          />
          <div>
            <h2 className="text-2xl font-bold mb-2">Our Mission</h2>
            <p className="mb-2">
              Where2Go is dedicated to helping you find the nearest restroom quickly and easily, reducing stress and discomfort when you're out and about. No more awkward moments or desperate searches, just open our site and go!
            </p>
            <p>
              We believe in making urban life more convenient and comfortable for everyone, whether you're a local, a tourist, or just passing through. With Where2Go, rest assured you'll always know where to go when nature calls.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}