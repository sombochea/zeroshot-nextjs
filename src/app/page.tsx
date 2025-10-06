import type { Product } from '@/types/product';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

async function getProducts(): Promise<Product[] | null> {
  try {
    // Construct the absolute URL for the internal API route.
    // This is crucial for server-side fetching to work reliably in different environments (local, Vercel, etc.).
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/products`, { cache: 'no-store' });

    if (!res.ok) {
      console.error('Failed to fetch products from internal API:', await res.text());
      return null;
    }

    return res.json();
  } catch (error) {
    console.error('An error occurred while fetching products:', error);
    return null;
  }
}

export default async function Home() {
  const products = await getProducts();

  if (!products) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-2xl font-bold">Error</h1>
        <p>Could not load products. Please try again later.</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-12 md:p-24">
      <h1 className="text-4xl font-bold mb-8">Product Catalog</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg overflow-hidden shadow-lg">
            <div className="relative w-full h-64">
              {product.images && product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold truncate">{product.title}</h2>
              <p className="text-gray-600 mt-2">${product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}