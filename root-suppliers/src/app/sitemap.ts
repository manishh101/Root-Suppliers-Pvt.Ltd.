import { MetadataRoute } from 'next'
import connectToDatabase from '@/lib/db/connect'
import Product from '@/lib/db/models/Product'
import Category from '@/lib/db/models/Category'
import Blog from '@/lib/db/models/Blog'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  // Static routes
  const routes = [
    '',
    '/about',
    '/products',
    '/categories',
    '/blogs',
    '/contact',
    '/services',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  try {
    await connectToDatabase()

    // Fetch dynamic data
    const products = await Product.find({ isActive: true }).select('slug updatedAt').lean()
    const categories = await Category.find({ isActive: true }).select('slug updatedAt').lean()
    const blogs = await Blog.find({ isPublished: true }).select('slug updatedAt').lean()

    const productEntries = products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    const categoryEntries = categories.map((category) => ({
      url: `${baseUrl}/categories/${category.slug}`,
      lastModified: new Date(category.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    const blogEntries = blogs.map((blog) => ({
      url: `${baseUrl}/blogs/${blog.slug}`,
      lastModified: new Date(blog.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    return [...routes, ...categoryEntries, ...productEntries, ...blogEntries]
  } catch (error) {
    console.error('Sitemap generation failed:', error)
    return routes
  }
}
