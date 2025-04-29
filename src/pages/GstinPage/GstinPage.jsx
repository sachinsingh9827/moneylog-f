import React, { useState, useEffect } from "react";
import "./MoneyLogPage.css";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

const MoneyLogPage = () => {
  // Set initial slide state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Define the features array
  const features = [
    {
      title: "Track Transactions in Real-time",
      description:
        "Monitor all your business transactions seamlessly. Track income, expenses, and outstanding balances — all in one place.",
    },
    {
      title: "Financial Reports at Your Fingertips",
      description:
        "Generate accurate financial reports with just a few clicks. From profit and loss to balance sheets, we make reporting easy.",
    },
    {
      title: "Customer and Supplier Management",
      description:
        "Keep track of customer and supplier details, their transactions, and compliance status for accurate financial reporting.",
    },
    {
      title: "Invoicing Made Simple",
      description:
        "Easily generate and send professional invoices. Track paid and outstanding invoices in real-time for better financial control.",
    },

    {
      title: "Cashflow Monitoring",
      description:
        "Track your incoming and outgoing transactions in real-time, helping you optimize your business's cash flow and make informed financial decisions.",
    },
  ];

  // Check if the screen is mobile
  const checkMobile = () => {
    if (window.innerWidth <= 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  // Add event listener on resize to update the screen size
  useEffect(() => {
    checkMobile(); // Check screen size on initial load
    window.addEventListener("resize", checkMobile); // Add resize event listener

    return () => {
      window.removeEventListener("resize", checkMobile); // Cleanup on component unmount
    };
  }, []);

  // Function to handle next slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % features.length);
  };

  // Function to handle previous slide
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + features.length) % features.length);
  };

  // Set up an interval to change slide every 2 seconds if on mobile
  useEffect(() => {
    if (isMobile) {
      const intervalId = setInterval(() => {
        nextSlide();
      }, 2000); // Change slide every 2 seconds

      // Cleanup the interval when the component unmounts or isMobile changes
      return () => clearInterval(intervalId);
    }
  }, [isMobile]); // Runs only when isMobile changes

  return (
    <div className="moneylog-container">
      <h1 className="moneylog-title">
        MoneyLog - Simplifying Your Business Finances
      </h1>

      <p className="moneylog-description">
        Manage your business finances effortlessly with MoneyLog. Track
        transactions, generate reports, and streamline your financial workflows
        in one place.
      </p>

      <p className="moneylog-description">
        With MoneyLog, automate tracking and invoicing to grow your business
        efficiently.
      </p>

      {/* <div className="divider-with-text">
        <span>AND THERE'S EVEN MORE...</span>
      </div> */}

      {/* Updated features section */}
      <div className={`features-section ${isMobile ? "swiper" : ""}`}>
        {/* Add a previous button for mobile screens */}
        {isMobile && (
          <div className="swiper-btn prev" onClick={prevSlide}>
            <IoIosArrowBack />
          </div>
        )}

        <div className="feature-box">
          <h3>{features[currentSlide].title}</h3>
          <p>{features[currentSlide].description}</p>
        </div>

        {/* Add a next button for mobile screens */}
        {isMobile && (
          <div className="swiper-btn next" onClick={nextSlide}>
            <IoIosArrowForward />
          </div>
        )}
      </div>

      {/* For desktop, show all features statically */}
      {!isMobile && (
        <div className="static-features">
          {features.map((feature, index) => (
            <div className="feature-box" key={index}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoneyLogPage;
