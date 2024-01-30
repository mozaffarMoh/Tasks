import * as React from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { CircularProgress } from "@mui/material";
import BoxMediaQuery from "@/app/MediaQuerys/BoxMedia";

export default function Loading({ progress }: any) {
  return (
    <Box
      position={BoxMediaQuery() ? "fixed" : "relative"}
      width={"100%"}
      p={1}
      display={"flex"}
      alignItems={"center"}
      height={20}
    >
      <CircularProgress size={25} />
      <Box width={"100%"} ml={1}>
        <LinearProgress
          variant="determinate"
          value={progress}
          color="secondary"
          sx={{ height: "12px", borderRadius: "5px" }}
        />
      </Box>
      <Box>
        <Typography variant="body1" ml={1}>
          {progress}%
        </Typography>
      </Box>
    </Box>
  );
}
