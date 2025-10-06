import { NextResponse } from 'next/server';

// The benefit of using a proxy route handler is that it hides the external API's URL from the client.
// This adds a layer of security and abstraction, as the frontend only interacts with our own server's API endpoint.
// It also helps to avoid CORS issues that might arise from making direct client-side requests to a third-party API.

export async function GET() {
  try {
    const response = await fetch('https://api.escuelajs.co/api/v1/products');

    if (!response.ok) {
      // If the external API returns an error, we forward it
      return new NextResponse(
        JSON.stringify({ message: 'Failed to fetch products from external API' }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching products:', error);
    return new NextResponse(
      JSON.stringify({ message: 'An internal server error occurred' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}