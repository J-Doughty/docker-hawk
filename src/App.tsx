import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { ImageSummary } from "./types/tauri/commands/docker/ImageSummary";

function App() {
  const [images, setImages] = useState<ImageSummary[]>();

  useEffect(() => {
    invoke<ImageSummary[]>("list_images").then(
      dockerImages => setImages(dockerImages)
    );
  }, [])

  return (
    <main className="container">
      <h1>Docker Hawk</h1>

      {images && images.flatMap(image => (
        <p>{image.RepoTags}</p>
      ))}
    </main>
  );
}

export default App;
