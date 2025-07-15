import { createFileRoute } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { ImageSummary } from "../../types/tauri/commands/docker/ImageSummary";
import ExpandableTable from "../../components/shared/table/expandableTable";
import PrimaryPageLayout from "../../components/shared/layout/primaryPageLayout";

export const Route = createFileRoute("/images/list")({
  component: RouteComponent,
});

const getSizeAsString = (numBytes: number) => {
  const bytesInAMegaByte = 1e6;
  const bytesInAGigaByte = 1e9;

  const numGigaBytes = numBytes / bytesInAGigaByte;

  if (numGigaBytes > 1) {
    return `${numGigaBytes.toFixed(2)} GB`;
  }

  return `${(numBytes / bytesInAMegaByte).toFixed(2)} MB`;
};

function RouteComponent() {
  const [images, setImages] = useState<ImageSummary[]>();

  useEffect(() => {
    invoke<ImageSummary[]>("list_images").then((dockerImages) =>
      setImages(dockerImages),
    );
  }, []);

  return (
    <PrimaryPageLayout>
      <h1>Images</h1>
      <section>
        {images && (
          <ExpandableTable
            columns={[
              {
                key: "name",
                displayName: "Name",
                width: { xs: "120px", sm: "50%" },
              },
              {
                key: "size",
                displayName: "Size",
                width: { sm: "110px", md: "180px", lg: "220px" },
              },
              {
                key: "numContainers",
                displayName: "Containers",
                width: { sm: "110px", md: "180px", lg: "180px" },
              },
              {
                key: "createdAt",
                displayName: "Created date",
                width: { xs: "25%", sm: "110px", md: "180px", lg: "220px" },
              },
            ]}
            columnsToHide={{
              xs: ["size", "numContainers"],
            }}
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
    </PrimaryPageLayout>
  );
}
