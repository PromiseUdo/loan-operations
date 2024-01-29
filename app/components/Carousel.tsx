"use client";

import React, { useEffect, useState } from "react";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { RxDotFilled } from "react-icons/rx";
import { setTimeout } from "timers";
import { clsx } from "clsx";
import Image from "next/image";
const slides = [
  {
    url: "/images/carousel1.jpg",
  },
  {
    url: "/images/carousel2.jpg",
  },
  {
    url: "/images/carousel3.jpg",
  },
  {
    url: "/images/carousel4.jpg",
  },
  {
    url: "/images/carousel5.jpg",
  },
  // {
  //   url: "/img/carousel6.webp",
  // },
];
const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  useEffect(() => {
    setTimeout(() => {
      nextSlide();
    }, 5000);
  });
  return (
    // <Container>
    <div className=" w-full h-[inherit] relative">
      <div
        style={{
          backgroundImage: `url(${slides[currentIndex].url})`,
          backgroundRepeat: "no-repeat",
        }}
        className="overflow-hidden object-center bg-cover aspect-w-16 aspect-h-9 relative w-full h-full aspect-square"
      >
        {/* <Image
          src={slides[currentIndex].url}
          alt="image"
          fill
          className="object-cover"
        /> */}
        <div className="absolute inset-0 bg-transparent"></div>
      </div>
      {/* left arrow */}
      {/* <div className="hidden md:block absolute top-[50%] -translate-x-0 translate-y-[50%] left-5 text-2xl shadow-sm rounded-full p-2 bg-white/50 text-white cursor-pointer">
        <BsChevronCompactLeft onClick={prevSlide} size={30} />
      </div> */}
      {/* right arrow */}
      {/* <div className="hidden md:block absolute top-[50%] -translate-x-0 translate-y-[50%] right-5 text-2xl shadow-sm rounded-full p-2 bg-white/50 text-white cursor-pointer">
        <BsChevronCompactRight onClick={nextSlide} size={30} />
      </div> */}
      <div className="hidden md:flex absolute h-8 w-full bottom-0  gap-2   justify-center py-2">
        {slides.map((slide, idx) => (
          <div
            onClick={() => goToSlide(idx)}
            key={idx}
            className={clsx(
              "p-2 text-2xl h-3 w-3 bg-white  rounded-full cursor-pointer",
              currentIndex !== idx && "bg-opacity-50"
            )}
          />
        ))}
      </div>
    </div>
    // </Container>
  );
};

export default Carousel;
