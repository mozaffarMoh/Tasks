import { useMediaQuery } from "@mui/material";


const BoxMediaQuery = () => {
     const BoxMedia = useMediaQuery("(max-width:800px)");
     return BoxMedia
};

export default BoxMediaQuery;