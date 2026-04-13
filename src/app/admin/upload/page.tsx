import { parseLeads } from '@/lib/parseLeads'
import UploadClient from './UploadClient'

export const dynamic = 'force-dynamic'

export default function AdminUploadPage() {
  const leads = parseLeads().map(l => ({ id: l.id, bedrijf: l.bedrijf }))
  return <UploadClient leads={leads} />
}
