import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { verifyAdmin } from "@/lib/auth";

/**
 * POST /api/revalidate
 * 
 * On-demand revalidation endpoint for admin to trigger cache updates
 * Requires authentication (admin only)
 * 
 * @body { path?: string, tag?: string, type?: 'product' | 'category' | 'brand' | 'blog' | 'home' }
 * @returns { success: boolean, message: string }
 */
export async function POST(req: NextRequest) {
  try {
    // Verify admin authentication
    await verifyAdmin(req);

    const body = await req.json();
    const { path, tag, type } = body;

    // Revalidate specific path
    if (path) {
      revalidatePath(path);
      return NextResponse.json({
        success: true,
        message: `Revalidated path: ${path}`,
        revalidated: true,
        now: Date.now(),
      });
    }

    // Revalidate by tag
    if (tag) {
      revalidateTag(tag);
      return NextResponse.json({
        success: true,
        message: `Revalidated tag: ${tag}`,
        revalidated: true,
        now: Date.now(),
      });
    }

    // Revalidate by type (common pages)
    if (type) {
      const pathsToRevalidate: string[] = [];

      switch (type) {
        case 'product':
          pathsToRevalidate.push('/products');
          pathsToRevalidate.push('/');
          break;
        case 'category':
          pathsToRevalidate.push('/categories');
          pathsToRevalidate.push('/');
          break;
        case 'brand':
          pathsToRevalidate.push('/brands');
          pathsToRevalidate.push('/');
          break;
        case 'blog':
          pathsToRevalidate.push('/blogs');
          break;
        case 'home':
          pathsToRevalidate.push('/');
          break;
        default:
          return NextResponse.json(
            { success: false, message: 'Invalid type specified' },
            { status: 400 }
          );
      }

      // Revalidate all paths
      pathsToRevalidate.forEach((p) => revalidatePath(p));

      return NextResponse.json({
        success: true,
        message: `Revalidated ${pathsToRevalidate.length} paths for type: ${type}`,
        paths: pathsToRevalidate,
        revalidated: true,
        now: Date.now(),
      });
    }

    return NextResponse.json(
      { success: false, message: 'Please specify path, tag, or type' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Revalidation failed',
        revalidated: false,
      },
      { status: 500 }
    );
  }
}
