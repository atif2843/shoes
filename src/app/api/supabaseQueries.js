import { supabase } from "./auth/supabaseClient";

// Get trending products
export async function getTrendingProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      productImages (
        prod_images
      )
    `
    )
    .eq("trending", true);

  if (error) throw error;
  return data;
}

// Get all brands
export async function getAllBrands() {
  const { data, error } = await supabase.from("brands").select("*");

  if (error) throw error;
  return data;
}

// Get products grouped by productType
export async function getProductsBySports() {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
        *,
        productImages (
            prod_images
        )
    `
    )
    .ilike("productType", "%sports%")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// Get latest 5 products
export async function getNewArrivals() {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      productImages (
        prod_images
      )
    `
    )
    .order("releaseDate", { ascending: false })
    .limit(10);

  if (error) throw error;
  return data;
}

// Get latest 5 brands from products
export async function getTopBrands() {
  // First, get the latest 5 brands
  const { data: brands, error: brandsError } = await supabase
    .from("brands")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  if (brandsError) throw brandsError;

  // Then, for each brand, get their products
  const brandsWithProducts = await Promise.all(
    brands.map(async (brand) => {
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select(
          `
          *,
          productImages (
            prod_images
          )
        `
        )
        .eq("brand", brand.name)
        .limit(4); // Get 4 products per brand

      if (productsError) throw productsError;

      return {
        ...brand,
        products: products || [],
      };
    })
  );

  return brandsWithProducts;
}

// Get product by slug
export async function getProductBySlug(slug) {
  try {
    console.log("Fetching product with slug:", slug);

    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        productImages (
          prod_images,
          prod_id
        )
      `
      )
      .eq("slug", slug)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    if (!data) {
      console.log("No product found with slug:", slug);
      return null;
    }

    // Transform the data to match the expected format
    const transformedData = {
      ...data,
      images: data.productImages.map((img) => img.prod_images),
      productImages: undefined, // Remove the original productImages array
      // Ensure all required fields are present
      name: data.name || "",
      sellPrice: data.sellPrice || 0,
      originalPrice: data.originalPrice || null,
      brand: data.brand || "",
      gender: data.gender || "",
      productType: data.productType || "",
      color: data.color || [],
      size: data.size || [],
      stock: data.stock || 0,
      description: data.description || "",
      slug: data.slug || "",
    };

    console.log("Product found:", transformedData);
    return transformedData;
  } catch (error) {
    console.error("Error in getProductBySlug:", error);
    throw error;
  }
}
