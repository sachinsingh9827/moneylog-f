import React from "react";
import { Box } from "@mui/material";
import Footer from "./Footer/Footer";
import HeroSection from "./HeroSection/HeroSection";
import GstinPage from "./GstinPage/GstinPage";
import WelcomePage from "./WelcomePage/WelcomePage";

export default function HomePage() {
  // const navigate = useNavigate();

  return (
    <Box className="image">
      <HeroSection />
      <WelcomePage />
      <GstinPage />
      {/* <MoneyLogSwiper /> */}
      <Footer />
    </Box>
  );
}
