import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'rxxuzi.com'

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000',
            color: '#fff',
          }}
        >
          <div style={{ fontSize: 120, fontWeight: 900 }}>
            {title}
          </div>
          <div style={{ fontSize: 40, marginTop: 40, opacity: 0.5 }}>
            Security & AI Developer
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: unknown) {
    console.log(e)
    return new Response('Failed to generate image', { status: 500 })
  }
}
