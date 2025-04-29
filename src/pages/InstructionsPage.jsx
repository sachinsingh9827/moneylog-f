import React, { useState } from "react";
import { Box, Button } from "@mui/material";

export default function InstructionsPage({
  title = "Instructions",
  steps = [],
}) {
  const [open, setOpen] = useState(true);

  return (
    <Box
      sx={{
        width: "100%",
        mt: 4,
        p: 3,
        borderRadius: 2,
        boxShadow: 0,
        backgroundColor: "transparent",
      }}
    >
      <Button
        variant="contained"
        size="small"
        onClick={() => setOpen(!open)}
        sx={{ mb: 2 }}
      >
        {open ? "Hide Instructions" : "Show Instructions"}
      </Button>

      {open && (
        <>
          <h3 style={{ marginBottom: 12 }}>{title}</h3>
          <ul style={{ paddingLeft: "20px", margin: 0 }}>
            {steps.map((step, index) => (
              <li key={index} style={{ marginBottom: "8px" }}>
                {step}
              </li>
            ))}
          </ul>
        </>
      )}
    </Box>
  );
}
