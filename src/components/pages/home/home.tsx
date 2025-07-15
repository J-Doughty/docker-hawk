import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import "./home.css";
import { DarkHawk, LightHawk } from "../../../assets";
import { useTheme } from "@mui/material/styles";
import ThemedLink from "../../shared/themedLink/themedLink";

function App() {
  const theme = useTheme();
  const hawkImage = theme.palette.mode == "light" ? LightHawk : DarkHawk;

  return (
    <section
      className="flex-column flex-grow"
      style={{
        backgroundImage: `url(${hawkImage})`,
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        backgroundSize: "contain",
        // backgroundPosition: "top left",
        // backgroundSize: "100% auto",
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
