import { ImageResponse } from 'next/og'

export const runtime = 'edge'

const OG_WIDTH = 1200
const OG_HEIGHT = 630

const RING_CENTER_X = 0.72
const RING_CENTER_Y = 0.6
const RING_COUNT = 22
const RING_MIN_SIZE = 120
const RING_MAX_SIZE = 1500
const RING_MAX_OPACITY = 0.09
const RING_MIN_OPACITY = 0.006

const GHOSTY_SIZE = 450

function buildRings() {
  const rings = []
  for (let i = 0; i < RING_COUNT; i++) {
    const t = i / (RING_COUNT - 1)
    const size = RING_MIN_SIZE + (RING_MAX_SIZE - RING_MIN_SIZE) * t
    const opacity = RING_MAX_OPACITY - (RING_MAX_OPACITY - RING_MIN_OPACITY) * t
    rings.push({ size: Math.round(size), opacity: +opacity.toFixed(4) })
  }
  return rings
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'rxxuzi.com'
    const ghostyUrl = new URL('/ghosty.png', request.url).toString()

    const serifFontData = await fetch(
      'https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSerif/NotoSerif-Bold.ttf'
    ).then((res) => res.arrayBuffer())

    const sansFontData = await fetch(
      'https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSans/NotoSans-Regular.ttf'
    ).then((res) => res.arrayBuffer())

    const titleFontSize = title.length > 20 ? 56 : title.length > 15 ? 72 : 96
    const rings = buildRings()
    const cx = OG_WIDTH * RING_CENTER_X
    const cy = OG_HEIGHT * RING_CENTER_Y

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: '#000',
          }}
        >
          {rings.map((ring, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: `${cy - ring.size / 2}px`,
                left: `${cx - ring.size / 2}px`,
                width: `${ring.size}px`,
                height: `${ring.size}px`,
                borderRadius: '50%',
                border: `1px solid rgba(255,255,255,${ring.opacity})`,
                display: 'flex',
              }}
            />
          ))}

          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '6%',
              right: '6%',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
              display: 'flex',
            }}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
              padding: '50px 80px 50px',
              position: 'relative',
              zIndex: 10,
            }}
          >
            <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    fontSize: titleFontSize,
                    fontFamily: 'Noto Serif',
                    fontWeight: 700,
                    color: '#fff',
                    lineHeight: 1.05,
                    letterSpacing: '-0.03em',
                  }}
                >
                  {title}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: `${GHOSTY_SIZE + 60}px`,
                }}
              >
                <img
                  src={ghostyUrl}
                  alt="Ghosty"
                  width={GHOSTY_SIZE}
                  height={GHOSTY_SIZE}
                  style={{
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 0 60px rgba(255,255,255,0.08))',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: 18,
                  color: '#ffffff',
                  fontFamily: 'Noto Sans',
                  fontWeight: 400,
                  letterSpacing: '0.02em',
                }}
              >
                https://rxxuzi.com
              </span>
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.12) 35%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.12) 65%, transparent 95%)',
              display: 'flex',
            }}
          />
        </div>
      ),
      {
        width: OG_WIDTH,
        height: OG_HEIGHT,
        fonts: [
          { name: 'Noto Serif', data: serifFontData, style: 'normal' as const, weight: 700 as const },
          { name: 'Noto Sans', data: sansFontData, style: 'normal' as const, weight: 400 as const },
        ],
      },
    )
  } catch (e: unknown) {
    console.log(e)
    return new Response('Failed to generate image', { status: 500 })
  }
}