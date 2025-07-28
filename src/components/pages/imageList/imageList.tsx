import { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";
import { invoke } from "@tauri-apps/api/core";

import { ImageSummary } from "../../../types/tauri/commands/docker/ImageSummary";
import PrimaryPageLayout from "../../shared/layout/primaryPageLayout";
import ExpandableTable from "../../shared/table/expandableTable";

const getSizeAsString = (numBytes: number) => {
  const bytesInAMegaByte = 1e6;
  const bytesInAGigaByte = 1e9;

  const numGigaBytes = numBytes / bytesInAGigaByte;

  if (numGigaBytes > 1) {
    return `${numGigaBytes.toFixed(2)} GB`;
  }

  return `${(numBytes / bytesInAMegaByte).toFixed(2)} MB`;
};

function ImageList() {
  const [images, setImages] = useState<ImageSummary[]>();

  useEffect(() => {
    invoke<ImageSummary[]>("list_images").then((dockerImages) =>
      setImages(dockerImages),
    );
  }, []);

  return (
    <PrimaryPageLayout>
      <h1>Images</h1>
      <section className="h-100 overflow-hidden">
        {images && (
          <ExpandableTable
            columns={[
              {
                field: "name",
                headerName: "Name",
                flex: 2,
              },
              {
                field: "size",
                headerName: "Size",
                flex: 1,
              },
              {
                field: "numContainers",
                headerName: "Containers",
                flex: 0.5,
              },
              {
                field: "createdAt",
                headerName: "Created date",
                flex: 1,
              },
            ]}
            rows={images.map((image) => ({
              id: image.Id,
              name: image.RepoTags.join(", "),
              size: getSizeAsString(image.Size),
              numContainers: image.Containers,
              createdAt: new Date(image.Created * 1000).toLocaleDateString(),
              expanded: {
                title: "Image details",
                body: (
                  <Typography>
                    <strong>Name:</strong> {image.RepoTags.join(", ")}
                  </Typography>
                ),
              },
              additionalData: {},
            }))}
          />
        )}
      </section>
    </PrimaryPageLayout>
  );
}

export default ImageList;
