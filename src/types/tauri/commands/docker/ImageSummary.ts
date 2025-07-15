export interface ImageSummary {
  Id: string;
  /// The ID of the parent image.
  ParentId: string;
  RepoTags: string[];
  RepoDigests: string[];
  /// Date and time at which the image was created as a Unix timestamp (number of seconds since EPOCH).
  Created: number;
  /// Total size of the image in Bytes.
  Size: number;
  SharedSize: number;
  VirtualSize?: number;
  Labels: Record<string, string>;
  Containers: number;
  /* Manifests: Option<Vec<ImageManifestSummary>>;
     descriptor: Option<OciDescriptor>; */
}
