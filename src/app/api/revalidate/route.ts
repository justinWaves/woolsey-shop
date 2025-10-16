import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// Webhook handler for Shopify product/collection updates
export async function POST(request: NextRequest) {
  try {
    // Verify the webhook secret
    const secret = request.nextUrl.searchParams.get('secret');
    
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    const body = await request.json();
    const topic = request.headers.get('x-shopify-topic');

    console.log('Webhook received:', topic, body);

    // Revalidate based on webhook topic
    switch (topic) {
      case 'products/create':
      case 'products/update':
      case 'products/delete': {
        const handle = body.handle;
        if (handle) {
          revalidateTag(`product-${handle}`);
          revalidatePath(`/product/${handle}`);
        }
        revalidateTag('products');
        revalidatePath('/shop');
        revalidatePath('/');
        break;
      }

      case 'collections/create':
      case 'collections/update':
      case 'collections/delete': {
        const handle = body.handle;
        if (handle) {
          revalidateTag(`collection-${handle}`);
          revalidatePath(`/collections/${handle}`);
        }
        revalidateTag('collections');
        revalidatePath('/artists');
        revalidatePath('/');
        break;
      }

      default:
        console.log('Unhandled webhook topic:', topic);
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    );
  }
}

