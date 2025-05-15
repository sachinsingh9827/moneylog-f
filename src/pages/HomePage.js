import React from "react";
import { Box } from "@mui/material";
import Footer from "./Footer/Footer";
import HeroSection from "./HeroSection/HeroSection";
import GstinPage from "./GstinPage/GstinPage";
import WelcomePage from "./WelcomePage/WelcomePage";
import BudgetWelcomePage from "./WelcomePage/BudgetWelcomePage";
import ThoughtCard from "./Thought/ThoughtCard";

export default function HomePage() {
  // const navigate = useNavigate();

  return (
    <Box className="image">
      <HeroSection />
      <WelcomePage />
      <ThoughtCard />

      <BudgetWelcomePage />
      <GstinPage />
      {/* <MoneyLogSwiper /> */}
      <Footer />
    </Box>
  );
}
