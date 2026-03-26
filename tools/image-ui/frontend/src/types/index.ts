export type StatusType = 'empty' | 'needs_generation' | 'needs_upload' | 'done'

export interface BrandConfig {
  name: string
  input_dir: string
  output_dir: string
  product_type: 'garment' | 'shoe'
  refs_dir: string
  flash_attempts: number
  delay: number
  use_flash: boolean
}

export interface RefStatus {
  name: string
  status: StatusType
  images: string[]
  input_photo_count: number
  input_photos?: string[]
  product_name?: string
  category?: string
}

export interface BrandStats {
  name: string
  config: BrandConfig
  total_refs: number
  empty_count: number
  needs_generation_count: number
  needs_upload_count: number
  done_count: number
}

export interface BatchEvent {
  type: 'ref_start' | 'ref_done' | 'ref_skipped' | 'ref_error' | 'log' | 'stopped' | 'batch_done' | 'error'
    | 'done' | 'upload_start' | 'upload_done'
  ref?: string
  message?: string
  index?: number
  total?: number
  success?: boolean
  done?: number
  skipped?: number
  error?: string
  ok?: number
  fail?: number
  output?: string
}
