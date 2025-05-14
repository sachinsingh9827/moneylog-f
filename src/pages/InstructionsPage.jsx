import React, { useState } from "react";
import { Box, Button } from "@mui/material";

export default function InstructionsPage({
  title = "Instructions",
  steps = [],
}) {
  const [open, setOpen] = useState(false);

  return (
    <Box
      sx={{
        width: "100%",
        mt: 4,
        p: 3,
        borderRadius: 2,
        boxShadow: 0,
      }}
    >
      <Button
        variant="contained"
        size="small"
        onClick={() => setOpen(!open)}
        sx={{
          mb: 2,
          backgroundColor: "#004080", // Custom background color
          color: "#fff", // Text color
          "&:hover": {
            backgroundColor: "#003366", // Hover color
          },
        }}
      >
        {open ? "Hide Instructions" : "Show Instructions"}
      </Button>

      {open && (
        <div
          style={{
            backgroundColor: "#fff",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          <h3 style={{ marginBottom: 12, color: "#004080" }}>{title}</h3>
          <ul style={{ paddingLeft: "15px", margin: 0 }}>
            {steps.map((step, index) => (
              <li key={index} style={{ marginBottom: "8px", color: "#004080" }}>
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Box>
  );
}
