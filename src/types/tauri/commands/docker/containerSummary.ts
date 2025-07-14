interface Port {
  PublicPort?: number;
  PrivatePort?: number;
}

enum ContainerSummaryStateEnum {
  EMPTY = "",
  CREATED = "created",
  RUNNING = "running",
  PAUSED = "paused",
  RESTARTING = "restarting",
  EXITED = "exited",
  REMOVING = "removing",
  DEAD = "dead",
}

interface ContainerSummaryHostConfig {
  NetworkMode?: string;
  Annotations?: Record<string, string>;
}

export interface ContainerSummary {
  Id?: string;
  Names?: string[];
  Image?: string;
  ImageID?: string;
  Command?: string;
  Created?: number;
  Ports?: Port[];
  SizeRw?: number;
  SizeRootFs?: number;
  Labels?: Record<string, string>;
  State?: ContainerSummaryStateEnum;
  Status?: string;
  HostConfig?: ContainerSummaryHostConfig;
  // pub image_manifest_descriptor: Option<OciDescriptor>,
  // pub network_settings: Option<ContainerSummaryNetworkSettings>,
  // pub mounts: Option<Vec<MountPoint>>,
}
