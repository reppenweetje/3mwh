import { parseLeads } from '@/lib/parseLeads'
import { getDocIds } from '@/lib/getDocs'
import DocsOverview from './UploadClient'

export const dynamic = 'force-dynamic'

export default function AdminUploadPage() {
  const leads = parseLeads()
  const docIds = getDocIds()

  const leadsWithStatus = leads.map((l) => ({
    id: l.id,
    bedrijf: l.bedrijf,
    hasDoc: docIds.has(l.id),
  }))

  return <DocsOverview leads={leadsWithStatus} />
}
