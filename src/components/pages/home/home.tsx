import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Link } from "@tanstack/react-router";

import "./home.css";
import { DarkHawk, LightHawk } from "../../../assets";
import { useTheme } from "@mui/material/styles";

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
            <Link to="/containers/list">Containers</Link> or view your{" "}
            <Link to="/images/list">Images</Link>
          </p>
        </Box>
      </Container>
    </section>
  );
}

export default App;
