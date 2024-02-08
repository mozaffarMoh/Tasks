import { Box, IconButton, Typography } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import { relative } from "path";
import { t } from "i18next";

const Footer = () => {
  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems={"center"}
      bgcolor={"rgb(243, 218, 218)"}
      padding={5}
      borderRadius={2}
    >
      <Typography variant="body2" fontWeight={600}>
        TASKS_Project
      </Typography>
      <Box>
        <IconButton
          color="primary"
          href="https://www.linkedin.com"
          target="_blank"
        >
          <LinkedInIcon />
        </IconButton>
        <IconButton
          color="secondary"
          href="https://www.facebook.com"
          target="_blank"
        >
          <FacebookIcon />
        </IconButton>
        <IconButton
          color="inherit"
          href="https://www.github.com"
          target="_blank"
        >
          <GitHubIcon />
        </IconButton>
      </Box>
      <Typography variant="body2">{t('footer.about')}</Typography>
      <Typography variant="body2">{t('footer.copyrights')} @2023</Typography>
    </Box>
  );
};

export default Footer;
