export interface AnswerItem {
  code: string
  category: string
  title: string
  answer: string
  bewijsstuk?: string
}

export interface Lead {
  id: string
  bedrijf: string
  score: number
  naam: string
  email: string
  ingediendOp: string
  documentsBundleUrl?: string
  documentsBundleType?: 'zip' | 'folder'
  antwoorden: AnswerItem[]
}
