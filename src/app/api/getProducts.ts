import { IProducts } from "@/interfaces/IProducts";
import toast from "react-hot-toast";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

// Obtener todos los productos
export const getProducts = async (): Promise<IProducts[]> => {
    try {
        console.log("Fetching products from:", `${APIURL}/products`);
        const response = await fetch(`${APIURL}/products`, {
            mode: 'cors',
            next: { revalidate: 1200 },
        });
        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        const contentType = response.headers.get("Content-Type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Unexpected content type, expected JSON");
        }

        const products: IProducts[] = await response.json();
        console.log("Fetched products:", products);
        return products;
    } catch (error: unknown) {
        // Verificamos si el error es una instancia de Error
        if (error instanceof Error) {
            console.error("Error fetching products:", error.message);
            throw new Error("Error loading products. Please try again later.");
        } else {
            console.error("Unknown error occurred:", error);
            throw new Error("An unknown error occurred while fetching products. Please try again later.");
        }
    }
};

// Obtener un producto específico por su ID
export const getProductById = async (id: string): Promise<IProducts> => {
    try {
        const response = await fetch(`${APIURL}/products/${id}`, {
            mode: 'cors',
            next: { revalidate: 1200 }
        });

        if (!response.ok) {
            throw new Error(`Error fetching product: ${response.status} ${response.statusText}`);
        }

        const product: IProducts = await response.json();
        return product;
    } catch (error: unknown) {
        // Verificamos si el error es una instancia de Error
        if (error instanceof Error) {
            console.error("Failed to fetch product:", error.message);
            throw new Error("Failed to load product. Please try again later.");
        } else {
            console.error("Unknown error occurred:", error);
            throw new Error("An unknown error occurred while fetching the product. Please try again later.");
        }
    }
};

// Obtener productos por categoría o nombre

export const getProductsByCategory = async (categoryId: string): Promise<IProducts[]> => {
    try {
        const res = await fetch(`${APIURL}/products?categoryId=${categoryId}`, {
            mode: 'cors',
            next: { revalidate: 1200 },
        });

        if (!res.ok) {
            throw new Error("Failed to fetch products");
        }

        const products: IProducts[] = await res.json();
        return products;
    } catch (error) {
        console.error("Error fetching products by category:", error);
        throw new Error("Failed to fetch products by category");
    }
};

export const getProductsByCategoryOrName = async (categoryOrName: string): Promise<IProducts[]> => {
    try {
      // Realizar la petición para obtener los productos filtrados por categoría o nombre
      const res = await fetch(`${APIURL}/products?category=${categoryOrName}`, {
        mode: 'cors',
        next: { revalidate: 1200 },
      });
  
      if (!res.ok) {
        throw new Error("Failed to fetch products by category or name");
      }
  
      const products: IProducts[] = await res.json();
      return products;
    } catch (error) {
      console.error("Error fetching products by category or name:", error);
      throw new Error("Failed to fetch products by category or name");
    }
  };

//obtener el token 
function getTokenFromCookies() {
    const cookies = document.cookie.split("; ");
    const loginDataCookie = cookies.find(cookie => cookie.startsWith("loginData="));
  
  
    if (!loginDataCookie) return null;
  
  
    const cookieValue = loginDataCookie.split("=")[1];
    const loginData = JSON.parse(decodeURIComponent(cookieValue));
  
  
    return loginData.token || null;
  }


//crear u nuevo producto
export async function addProduct(product:IProducts) {
    const token = getTokenFromCookies();
  
    if (!token) {
      toast.error("No token found in cookies");
      return null;
    }
  
    try {
      const res = await fetch(`${APIURL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error adding product");
      }
  
      const data = await res.json();
      toast.success("Product added successfully!");
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errorMessage || "Failed to add product. Please try again.");
      return null;
    }
  }
  
// Actualizar un producto existente
export async function updateProduct(id: string, product: IProducts) {
    const token = getTokenFromCookies();

    if (!token) {
        toast.error("No token found in cookies");
        return null;
    }

    try {
        const res = await fetch(`${APIURL}/products/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(product),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Error updating product");
        }

        const data = await res.json();
        toast.success("Product updated successfully!");
        return data;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        toast.error(errorMessage || "Failed to update product. Please try again.");
        return null;
    }
}

//cambiar el estado de un producto
export async function toggleProduct(productId: string) {
    const token = getTokenFromCookies();
  
    if (!token) {
      toast.error("No token found in cookies");
      return null;
    }
  
    try {
      const res = await fetch(`${APIURL}/products/toggle-status/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error updating gym status");
      }
  
      const data = await res.json();
      toast.success("Product status updated successfully!");
      return data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errorMessage || "Failed to update gym status.");
      return null;
    }
  }