import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useTheme } from "@mui/material/styles";

import { DarkHawkUrl, LightHawkUrl } from "../../../assets";
import ThemedLink from "../../shared/themedLink/themedLink";

import "./home.css";

function App() {
  const theme = useTheme();
  const hawkImage = theme.palette.mode === "light" ? LightHawkUrl : DarkHawkUrl;

  return (
    <section
      className="flex-column flex-grow"
      style={{
        backgroundImage: `url(${hawkImage})`,
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        backgroundSize: "contain",
      }}
    >
      <Container className="flex-grow flex-column home-container">
        <h1 className="text-center">Docker Hawk</h1>
        <Box>
          <p>
            To start using Docker Hawk visit your{" "}
            <ThemedLink to="/containers/list">Containers</ThemedLink> or view
            your <ThemedLink to="/images/list">Images</ThemedLink>
          </p>
        </Box>
      </Container>
    </section>
  );
}

export default App;
