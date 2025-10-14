import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'NextAuth test route is working',
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ 
    message: 'NextAuth POST test route is working',
    timestamp: new Date().toISOString()
  })
}