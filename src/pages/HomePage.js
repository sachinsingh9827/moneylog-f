import React from "react";
import { Box } from "@mui/material";
import Footer from "./Footer/Footer";
import HeroSection from "./HeroSection/HeroSection";
import MoneyLogSwiper from "./MoneyLogSwiper/MoneyLogSwiper";
import GstinPage from "./GstinPage/GstinPage";
import AboutPage from "./AboutPage/AboutPage";

export default function HomePage() {
  // const navigate = useNavigate();

  return (
    <Box className="image">
      <HeroSection />
      <GstinPage />
      {/* <MoneyLogSwiper /> */}
      <Footer />
    </Box>
  );
}
