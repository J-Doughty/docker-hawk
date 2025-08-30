import { ContainerSummary } from "./ContainerSummary";
import { ImageSummary } from "./ImageSummary";

export interface InitialSetupResponse {
    initialSetupComplete: boolean;
    images?: ImageSummary[];
    containers?: ContainerSummary[];
}