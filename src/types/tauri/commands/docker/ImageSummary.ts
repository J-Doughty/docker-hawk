export interface ImageSummary {
  Id: string;
  ParentId: string;
  RepoTags: string[];
  RepoDigests: string[];
  Created: number;
  Size: number;
  SharedSize: number;
  VirtualSize?: number;
  Labels: Record<string, string>;
  Containers: number;
  // manifests: Option<Vec<ImageManifestSummary>>;
  // descriptor: Option<OciDescriptor>;
}
