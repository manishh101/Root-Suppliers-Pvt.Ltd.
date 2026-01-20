import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Revalidate all pages in the app
 */
export function revalidateAll() {
  revalidatePath("/", "layout");
}

/**
 * Revalidate product-related pages
 */
export function revalidateProducts(productSlug?: string, categorySlug?: string) {
  revalidatePath("/", "layout");
  revalidatePath("/products");
  if (productSlug) {
    revalidatePath(`/products/${productSlug}`);
  }
  if (categorySlug) {
    revalidatePath(`/categories/${categorySlug}`);
  }
  revalidateTag("products");
}

/**
 * Revalidate category-related pages
 */
export function revalidateCategories(categorySlug?: string) {
  revalidatePath("/", "layout");
  revalidatePath("/categories");
  revalidatePath("/products");
  if (categorySlug) {
    revalidatePath(`/categories/${categorySlug}`);
  }
  revalidateTag("categories");
  revalidateTag("products"); // Categories affect product pages
}

/**
 * Revalidate brand-related pages
 */
export function revalidateBrands() {
  revalidatePath("/", "layout");
  revalidatePath("/brands");
  revalidateTag("brands");
}

/**
 * Revalidate blog-related pages
 */
export function revalidateBlogs(blogSlug?: string) {
  revalidatePath("/", "layout");
  revalidatePath("/blogs");
  if (blogSlug) {
    revalidatePath(`/blogs/${blogSlug}`);
  }
  revalidateTag("blogs");
}

/**
 * Revalidate hero slides (affects homepage)
 */
export function revalidateHeroSlides() {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidateTag("hero-slides");
}

/**
 * Revalidate testimonials (affects multiple pages)
 */
export function revalidateTestimonials() {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/about");
  revalidateTag("testimonials");
}

/**
 * Revalidate settings (affects entire site)
 */
export function revalidateSettings() {
  revalidatePath("/", "layout");
  revalidateTag("settings");
}
