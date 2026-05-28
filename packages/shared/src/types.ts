export type Template = 'A' | 'B' | 'C'

export interface CtaItem {
  label: string
  url: string
}

/** Built-in chip ids are 'feature' | 'update' | 'fix'; any other string is a custom chip label */
export type ChipType = string

export type GoLiveType = 'single' | 'multiple'

export type ImageSize = 'small' | 'medium' | 'large'

export type ReleaseStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'published'
  | 'archived'

export type MediaType = 'image' | 'youtube' | 'lottie'

export interface ReleaseSection {
  id: string
  title: string
  heading: string
  body: string | null
  bullet_list: string[] | null
  media_url: string | null
  media_type: MediaType | null
  ctas: CtaItem[] | null
  image_size: ImageSize | null
  chip: ChipType | null
}

export interface ReleaseContent {
  heading: string
  body: string | null
  bullet_list: string[] | null
  media_url: string | null
  media_type: MediaType | null
  ctas: CtaItem[] | null
  chip: ChipType | null
  sections: ReleaseSection[] | null
}

export interface Release {
  id: string
  title: string
  template: Template
  go_live_type: GoLiveType
  image_size: ImageSize | null
  status: ReleaseStatus
  submitted_at: string | null
  approved_at: string | null
  published_at: string | null
  archived_at: string | null
  created_at: string
  updated_at: string
}

export interface ReleaseWithContent extends Release {
  content: ReleaseContent
}

export interface ActiveReleaseItem extends ReleaseWithContent {
  acknowledged: boolean
  dismissed_count: number
}

export interface ActiveReleaseResponse {
  releases: ActiveReleaseItem[]
  sidebar_enabled: boolean
}

export interface SettingsResponse {
  sidebar_enabled: boolean
}

// Prop type for TemplateA/B/C components (used in both builder preview and renderer)
export interface TemplateProps {
  content: ReleaseContent
}

// Request body for create/update release
export interface ReleasePayload {
  title: string
  template: Template
  go_live_type: GoLiveType
  image_size?: ImageSize | null
  heading: string
  body?: string | null
  bullet_list?: string[] | null
  media_url?: string | null
  media_type?: MediaType | null
  ctas?: CtaItem[] | null
  chip?: ChipType | null
  sections?: ReleaseSection[] | null
}
