import { AwsClient } from 'aws4fetch'

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'rxxuzi-r2'
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || 'https://fx.rxxuzi.com'

const r2 = new AwsClient({
  accessKeyId: R2_ACCESS_KEY_ID,
  secretAccessKey: R2_SECRET_ACCESS_KEY,
  service: 's3',
  region: 'auto',
})

const R2_ENDPOINT = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`

export interface R2File {
  name: string
  key: string
  size: string
  sizeBytes: number
  date: string
  type: string
  url: string
  isFolder: boolean
}

export interface R2ListResult {
  files: R2File[]
  folders: string[]
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

function getFileType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  const types: Record<string, string> = {
    pdf: 'PDF',
    zip: 'ZIP',
    png: 'IMG',
    jpg: 'IMG',
    jpeg: 'IMG',
    gif: 'IMG',
    webp: 'IMG',
    svg: 'IMG',
    mp4: 'VIDEO',
    webm: 'VIDEO',
    mov: 'VIDEO',
    mp3: 'AUDIO',
    wav: 'AUDIO',
    txt: 'TEXT',
    md: 'MD',
    json: 'JSON',
    js: 'JS',
    ts: 'TS',
    html: 'HTML',
    css: 'CSS',
  }
  return types[ext] || ext.toUpperCase() || 'FILE'
}

interface S3Object {
  Key?: string
  Size?: number
  LastModified?: string
}

interface S3CommonPrefix {
  Prefix?: string
}

function parseListResponse(xml: string): { contents: S3Object[], prefixes: S3CommonPrefix[] } {
  const contents: S3Object[] = []
  const prefixes: S3CommonPrefix[] = []

  // Parse Contents
  const contentMatches = xml.matchAll(/<Contents>([\s\S]*?)<\/Contents>/g)
  for (const match of contentMatches) {
    const content = match[1]
    const key = content.match(/<Key>(.*?)<\/Key>/)?.[1]
    const size = content.match(/<Size>(.*?)<\/Size>/)?.[1]
    const lastModified = content.match(/<LastModified>(.*?)<\/LastModified>/)?.[1]
    contents.push({
      Key: key,
      Size: size ? parseInt(size, 10) : 0,
      LastModified: lastModified,
    })
  }

  // Parse CommonPrefixes
  const prefixMatches = xml.matchAll(/<CommonPrefixes>([\s\S]*?)<\/CommonPrefixes>/g)
  for (const match of prefixMatches) {
    const prefix = match[1].match(/<Prefix>(.*?)<\/Prefix>/)?.[1]
    if (prefix) {
      prefixes.push({ Prefix: prefix })
    }
  }

  return { contents, prefixes }
}

export async function listFilesInFolder(prefix?: string): Promise<R2ListResult> {
  try {
    const normalizedPrefix = prefix ? (prefix.endsWith('/') ? prefix : `${prefix}/`) : ''

    const params = new URLSearchParams({
      'list-type': '2',
      'delimiter': '/',
    })
    if (normalizedPrefix) {
      params.set('prefix', normalizedPrefix)
    }

    const url = `${R2_ENDPOINT}/${R2_BUCKET_NAME}?${params.toString()}`
    const response = await r2.fetch(url)

    if (!response.ok) {
      throw new Error(`R2 API error: ${response.status} ${response.statusText}`)
    }

    const xml = await response.text()
    const { contents, prefixes } = parseListResponse(xml)

    const folders = prefixes
      .map(p => p.Prefix!)
      .filter(Boolean)
      .map(p => p.replace(normalizedPrefix, '').replace(/\/$/, ''))

    const files = contents
      .filter(obj => obj.Key && obj.Key !== normalizedPrefix)
      .map(obj => {
        const sizeBytes = obj.Size || 0
        return {
          name: obj.Key!.split('/').pop() || obj.Key!,
          key: obj.Key!,
          size: formatBytes(sizeBytes),
          sizeBytes,
          date: formatDate(obj.LastModified ? new Date(obj.LastModified) : new Date()),
          type: getFileType(obj.Key!),
          url: `${R2_PUBLIC_URL}/${obj.Key}`,
          isFolder: false,
        }
      })
      .sort((a, b) => b.date.localeCompare(a.date))

    return { files, folders }
  } catch (error) {
    console.error('R2 list error:', error)
    return { files: [], folders: [] }
  }
}

// Legacy function for /files page (flat list)
export async function listFiles(prefix?: string): Promise<R2File[]> {
  try {
    const params = new URLSearchParams({ 'list-type': '2' })
    if (prefix) {
      params.set('prefix', prefix)
    }

    const url = `${R2_ENDPOINT}/${R2_BUCKET_NAME}?${params.toString()}`
    const response = await r2.fetch(url)

    if (!response.ok) {
      throw new Error(`R2 API error: ${response.status} ${response.statusText}`)
    }

    const xml = await response.text()
    const { contents } = parseListResponse(xml)

    return contents
      .filter(obj => obj.Key && obj.Size && obj.Size > 0)
      .map(obj => {
        const sizeBytes = obj.Size || 0
        return {
          name: obj.Key!.split('/').pop() || obj.Key!,
          key: obj.Key!,
          size: formatBytes(sizeBytes),
          sizeBytes,
          date: formatDate(obj.LastModified ? new Date(obj.LastModified) : new Date()),
          type: getFileType(obj.Key!),
          url: `${R2_PUBLIC_URL}/${obj.Key}`,
          isFolder: false,
        }
      })
      .sort((a, b) => b.date.localeCompare(a.date))
  } catch (error) {
    console.error('R2 list error:', error)
    return []
  }
}

export async function uploadFile(key: string, body: Buffer | Uint8Array, contentType?: string): Promise<boolean> {
  try {
    const url = `${R2_ENDPOINT}/${R2_BUCKET_NAME}/${key}`
    const response = await r2.fetch(url, {
      method: 'PUT',
      body: body as BodyInit,
      headers: contentType ? { 'Content-Type': contentType } : undefined,
    })
    return response.ok
  } catch (error) {
    console.error('R2 upload error:', error)
    return false
  }
}

export async function deleteFile(key: string): Promise<boolean> {
  try {
    const url = `${R2_ENDPOINT}/${R2_BUCKET_NAME}/${key}`
    const response = await r2.fetch(url, { method: 'DELETE' })
    return response.ok
  } catch (error) {
    console.error('R2 delete error:', error)
    return false
  }
}

export async function createFolder(path: string): Promise<boolean> {
  const folderKey = path.endsWith('/') ? path : `${path}/`
  return uploadFile(`${folderKey}.keep`, new Uint8Array(0), 'application/octet-stream')
}

export function getPublicUrl(key: string): string {
  return `${R2_PUBLIC_URL}/${key}`
}
