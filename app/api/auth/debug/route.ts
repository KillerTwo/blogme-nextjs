import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { handlers, auth } = await import('@/auth')
    return NextResponse.json({ 
      message: 'Auth import successful',
      hasHandlers: !!handlers,
      hasAuth: !!auth
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Auth import failed',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}