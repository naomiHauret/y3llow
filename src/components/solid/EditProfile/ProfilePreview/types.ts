import type { BasicProfile } from "@datamodels/identity-profile-basic";

interface ProfilePreview extends BasicProfile {
    banner?: string
    avatar?: string
}
export interface ProfilePreviewProps {
  data: ProfilePreview
}