import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { listFilesInFolder, uploadFile, deleteFile, createFolder } from '@/lib/r2'

export async function GET(request: NextRequest) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const prefix = searchParams.get('prefix') || ''

  const result = await listFilesInFolder(prefix)
  return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const contentType = request.headers.get('content-type') || ''

    // Create folder
    if (contentType.includes('application/json')) {
      const { action, path } = await request.json()
      if (action === 'createFolder' && path) {
        const success = await createFolder(path)
        if (!success) {
          return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 })
        }
        return NextResponse.json({ success: true })
      }
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Upload file
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const path = formData.get('path') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)
    const key = path && path !== '' ? `${path}/${file.name}` : file.name

    console.log('Uploading:', { key, size: buffer.length, type: file.type })

    const success = await uploadFile(key, buffer, file.type)

    if (!success) {
      return NextResponse.json({ error: 'R2 upload failed' }, { status: 500 })
    }

    return NextResponse.json({ success: true, key })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { key } = await request.json()

    if (!key) {
      return NextResponse.json({ error: 'No key provided' }, { status: 400 })
    }

    const success = await deleteFile(key)

    if (!success) {
      return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
