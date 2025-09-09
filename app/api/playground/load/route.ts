// app/api/playground/load/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body if needed
    await request.json().catch(() => ({}));
    
    // Your playground loading logic here
    // For example, you might load saved playground state from a database
    
    // Return a successful response with playground data
    return NextResponse.json({
      success: true,
      data: {
        // Add your playground data here
        code: '',
        settings: {},
        // ... other playground state
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error loading playground:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to load playground' 
      }, 
      { status: 500 }
    );
  }
}

// Optionally handle GET requests
export async function GET() {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Method not allowed. Use POST instead.' 
    }, 
    { status: 405 }
  );
}