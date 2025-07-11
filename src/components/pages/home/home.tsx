import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Link } from "@tanstack/react-router";

import "./home.css"
import { Hawk } from "../../../assets";

function App() {
    return (
        <section className="flex-column h-100" style={{
            backgroundImage: `url(${Hawk})`,
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            backgroundPosition: "center",
            backgroundSize: "contain",
        }}>
            <Container className="h-100 flex-column home-container" >
                <h1>Docker Hawk</h1>
                <Box>
                    <p>
                        To start using Docker Hawk visit your{" "}
                        <Link to="/containers/list">Containers</Link>{" "}
                        or view your <Link to="/images/list">Images</Link>
                    </p>
                </Box>
            </Container>
        </section >
    );
}

export default App;
