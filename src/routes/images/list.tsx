import { createFileRoute } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { ImageSummary } from "../../types/tauri/commands/docker/ImageSummary";
import ExpandableTable from "../../components/shared/table/expandableTable";

export const Route = createFileRoute("/images/list")({
  component: RouteComponent,
});

const getSizeAsString = (numBytes: number) => {
  const bytesInAMegaByte = 1e6;
  const bytesInAGigaByte = 1e9;

  const numGigaBytes = numBytes / bytesInAGigaByte;

  if (numGigaBytes > 1) {
    return `${numGigaBytes.toFixed(2)} GB`
  }

  return `${(numBytes / bytesInAMegaByte).toFixed(2)} MB`
}

function RouteComponent() {
  const [images, setImages] = useState<ImageSummary[]>();

  useEffect(() => {
    invoke<ImageSummary[]>("list_images").then((dockerImages) =>
      setImages(dockerImages),
    );
  }, []);

  return (
    <section>
      {images && (
        <ExpandableTable
          columns={[
            { key: "name", displayName: "Name", width: { xs: "120px", sm: "100%" } },
            { key: "size", displayName: "Size", width: { xs: "110px", sm: "110px", md: "150px", lg: "220px" } },
            { key: "numContainers", displayName: "Containers", width: { xs: "50%", sm: "110px", md: "150px", lg: "150px" } },
            { key: "createdAt", displayName: "Created date", width: { xs: "50%", sm: "110px", md: "150px", lg: "220px" } },
          ]}
          rows={images.map((image) => ({
            key: image.Id,
            rowValues: {
              name: image.RepoTags.join(", "),
              size: getSizeAsString(image.Size),
              numContainers: image.Containers,
              createdAt: new Date(image.Created * 1000).toLocaleDateString(),
            },
            expandablePanel: <>Expanded</>,
          }))}
        />
      )}
    </section>
  );
}
