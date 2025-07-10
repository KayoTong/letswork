import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

const images = [
  'https://images.ctfassets.net/ypfe9l9zihcg/4W1Dgfj6QECIq4Oey0IQMi/4c044358096870a234a1ecd5f84f5d39/Forest-Hills-what-to-expect-1.jpg',
  'https://media.istockphoto.com/id/540718910/photo/williamsburg-street-scene-in-brooklyn-new-york-city.jpg?s=612x612&w=0&k=20&c=w3_jyFcS6y_-FXWYISiOgYLBIT_B-yNmOLk59OCROno=',
  'https://images.ctfassets.net/1aemqu6a6t65/6yhRUmlUlQIu7R7vpwjY8x/fdb889151c8d0af07e7876f0a9dde49a/Flushing-Queens-NYC-Photo-Julienne-Schaer.jpg',
  'https://i.insider.com/5dc588fe695b587d670d3d4d?width=800&format=jpeg&auto=webp',
  'https://media.timeout.com/images/106160192/image.jpg',
  'https://static01.nyt.com/images/2018/07/15/realestate/15LIVING-IN-INWOOD-SUB/15LIVING-IN-INWOOD-SUB-superJumbo-v2.jpg?quality=75&auto=webp&disable=upscale',
  'https://static01.nyt.com/images/2014/07/27/realestate/20140727-LIVING-slide-28V2/20140727-LIVING-slide-28V2-superJumbo.jpg',
  'https://media.timeout.com/images/105222275/image.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/a/af/USA-NYC-Koreatown99.jpg',
  'https://media.istockphoto.com/id/186211642/photo/aerial-view-upper-west-side-buildings-central-park-new-york.jpg?s=612x612&w=0&k=20&c=VvMmCr8_XAZAG7sRMFlggeFJPEYsEdL5iu5fuWpTEmM=',
  'https://images.ctfassets.net/1aemqu6a6t65/6NhevN98Mz9DW86whLfYnu/496bd79329b991df36089861d596b518/Upper-West-Side-NYC-Lanna-Apisukh-1304.jpg',
];

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-100 py-8">
      <div className="relative w-full max-w-4xl rounded-2xl shadow-xl bg-white overflow-hidden border mx-4">
        {/* Slides */}
        <div className="relative w-full h-[60vh] md:h-[75vh]">
          {images.map((img, idx) => (
            <img
              key={img}
              src={img}
              alt="NYC Slideshow"
              className={`absolute w-full h-full object-cover transition-opacity duration-1000 ease-in-out rounded-2xl ${
                idx === current ? 'opacity-100 z-20' : 'opacity-0 z-10'
              }`}
              style={{ filter: 'brightness(0.7)' }}
              draggable={false}
            />
          ))}
          {/* Overlay */}
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-white text-center px-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">Welcome to Where2Go!</h1>
            <p className="text-base sm:text-lg md:text-2xl mb-8 drop-shadow">Your solution to finding the nearest restroom when you need it most.</p>
            <Link
              to="/finder"
              className="bg-[#72b8f0] hover:bg-[#5ba7e4] text-white font-bold py-3 px-8 rounded-lg text-lg md:text-xl shadow-lg transition-colors duration-200 finder-button"
            >
              Find a Restroom
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}