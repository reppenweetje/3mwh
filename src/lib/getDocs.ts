import fs from 'fs'
import path from 'path'

const DOCS_DIR = path.join(process.cwd(), 'docs')

/** Geeft een Set terug van alle lead-IDs waarvoor een ZIP-bestand bestaat in docs/ */
export function getDocIds(): Set<string> {
  try {
    return new Set(
      fs.readdirSync(DOCS_DIR)
        .filter((f) => f.endsWith('.zip'))
        .map((f) => f.replace('.zip', ''))
    )
  } catch {
    return new Set()
  }
}

/** Controleert of een specifiek bestand bestaat */
export function docExists(leadId: string): boolean {
  return fs.existsSync(path.join(DOCS_DIR, `${leadId}.zip`))
}

/** Geeft het volledige pad naar het ZIP-bestand van een lead */
export function docPath(leadId: string): string {
  return path.join(DOCS_DIR, `${leadId}.zip`)
}
