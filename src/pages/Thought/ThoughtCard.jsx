import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Stack,
} from "@mui/material";

const thoughts = [
  "Save money, and money will save you.",
  "Invest in yourself — it's the best investment.",
  "Small daily earnings add up to big success.",
  "Passive income is key to financial freedom.",
  "Don't work for money, make money work for you.",
  "Financial discipline builds long-term wealth.",
  "Multiple income streams secure your future.",
  "Spend less than you earn, always.",
  "Learn skills that help you earn more.",
  "Rich mindset starts with small smart habits.",
  "Earning more starts with learning more.",
  "Cut unnecessary expenses to grow savings.",
  "Financial literacy empowers smart decisions.",
  "Create assets, not liabilities.",
  "Every rupee saved is a rupee earned.",
  "Budgeting is your first step to wealth.",
  "Start small, think big, earn consistently.",
  "Side hustles can become main income.",
  "Don't chase money, build value.",
  "Focus on growth, not just income.",
  "Success comes from smart financial habits.",
  "Wealth is built with patience and planning.",
  "Be consistent, not perfect, in saving.",
  "Early investments reap big rewards.",
  "Track your expenses daily.",
  "Automate savings for financial discipline.",
  "Emergency fund is your safety net.",
  "Financial freedom requires sacrifices now.",
  "Avoid debt traps, spend wisely.",
  "Every skill you learn can earn you money.",
];

const translateText = async (text, targetLang) => {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(
    text
  )}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Translation API failed");
    }
    const data = await res.json();
    return data[0][0][0];
  } catch (error) {
    console.error("Error during translation:", error);
    return text; // fallback original text on error
  }
};

const ThoughtCard = () => {
  // Random thought index on initial load
  const getRandomIndex = () => Math.floor(Math.random() * thoughts.length);

  const [language, setLanguage] = useState("en");
  const [currentThoughtIndex, setCurrentThoughtIndex] =
    useState(getRandomIndex);
  const [translatedThought, setTranslatedThought] = useState("");
  const [loading, setLoading] = useState(false);
  const [typedText, setTypedText] = useState("");
  const typingIntervalRef = useRef(null);

  // Load and translate thought if needed
  useEffect(() => {
    const loadThought = async () => {
      if (language === "en") {
        setTranslatedThought(thoughts[currentThoughtIndex]);
      } else {
        setLoading(true);
        const translated = await translateText(
          thoughts[currentThoughtIndex],
          "hi"
        );
        setTranslatedThought(translated);
        setLoading(false);
      }
    };
    loadThought();
  }, [language, currentThoughtIndex]);

  // Typewriter effect
  useEffect(() => {
    if (loading) {
      setTypedText("");
      return;
    }

    let index = 0;
    setTypedText("");

    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

    typingIntervalRef.current = setInterval(() => {
      index++;
      if (index > translatedThought.length) {
        clearInterval(typingIntervalRef.current);
      } else {
        setTypedText(translatedThought.slice(0, index));
      }
    }, 40);

    return () => clearInterval(typingIntervalRef.current);
  }, [translatedThought, loading]);

  const handleLanguageChange = (event, newLang) => {
    if (newLang !== null) {
      setLanguage(newLang);
    }
  };

  const handlePrev = () => {
    setCurrentThoughtIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentThoughtIndex((prev) =>
      prev < thoughts.length - 1 ? prev + 1 : prev
    );
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        minHeight: "90vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: { xs: 2, sm: 4, md: 8 },
      }}
    >
      <Card
        sx={{
          background: "rgba(222, 219, 219, 0.35)",
          backdropFilter: "blur(15px)",
          borderRadius: "20px",
          boxShadow: "0 8px 24px rgba(0, 64, 128, 0.15)",
          maxWidth: "full",
          width: "100%",
          p: { xs: 3, sm: 5 },
          display: "flex",
          flexDirection: "column",
          color: "#003366",
          minHeight: 400,
          justifyContent: "space-between",
        }}
      >
        <CardContent sx={{ width: "100%" }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            sx={{ mb: { xs: 3, sm: 5 }, gap: 2 }}
          >
            <Typography
              variant="h4"
              sx={{
                flexGrow: 1,
                fontWeight: "700",
                textAlign: { xs: "center", sm: "left" },
                color: "#004080",
              }}
            >
              💡 Thought of the Moment
            </Typography>

            <ToggleButtonGroup
              value={language}
              exclusive
              onChange={handleLanguageChange}
              size="medium"
              color="primary"
              sx={{
                mt: { xs: 1, sm: 0 },
                justifyContent: { xs: "center", sm: "flex-end" },
                flexGrow: 0,
              }}
            >
              <ToggleButton value="en" sx={{ fontWeight: "600" }}>
                EN
              </ToggleButton>
              <ToggleButton value="hi" sx={{ fontWeight: "600" }}>
                हिंदी
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 120,
                mb: 5,
              }}
            >
              <CircularProgress size={50} />
            </Box>
          ) : (
            <Typography
              variant="h5"
              sx={{
                minHeight: 150,
                mb: 5,
                px: { xs: 2, sm: 4 },
                fontFamily: "'Courier New', Courier, monospace",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                fontWeight: 500,
                fontSize: { xs: "1.3rem", sm: "1.7rem" },
                color: "#002244",
                textAlign: "center",
                letterSpacing: "0.04em",
                lineHeight: 1.6,
                borderLeft: "4px solid #004080",
                paddingLeft: 3,
                position: "relative",
              }}
            >
              <span style={{ color: "#004080" }}>{typedText}</span>
              <span
                style={{
                  display: "inline-block",
                  width: 12,
                  backgroundColor: "#004080",
                  marginLeft: 3,
                  animation: "blink 1s infinite",
                  height: "1.4em",
                  verticalAlign: "bottom",
                  borderRadius: 1,
                }}
              />
            </Typography>
          )}

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            justifyContent="center"
            sx={{ mt: 3 }}
          >
            <Button
              variant="outlined"
              onClick={handlePrev}
              disabled={currentThoughtIndex === 0 || loading}
              sx={{
                minWidth: 130,
                fontSize: { xs: "1rem", sm: "1.1rem" },
                px: 3,
                py: 1.5,
                borderColor: "#004080",
                color: "#004080",
                "&:disabled": {
                  borderColor: "#a0a0a0",
                  color: "#a0a0a0",
                },
              }}
            >
              Prev
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={currentThoughtIndex === thoughts.length - 1 || loading}
              sx={{
                minWidth: 130,
                fontSize: { xs: "1rem", sm: "1.1rem" },
                px: 3,
                py: 1.5,
                backgroundColor: "#004080",
                "&:hover": {
                  backgroundColor: "#002952",
                },
                "&:disabled": {
                  backgroundColor: "#a0a0a0",
                  color: "#fff",
                },
              }}
            >
              Next
            </Button>
          </Stack>
        </CardContent>

        {/* Blinking cursor animation */}
        <style>{`
          @keyframes blink {
            0%, 50%, 100% { opacity: 1; }
            25%, 75% { opacity: 0; }
          }
        `}</style>
      </Card>
    </Container>
  );
};

export default ThoughtCard;
