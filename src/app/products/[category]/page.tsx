import { getProductsByCategoryOrName } from "@/app/api/getProducts";
import Card from "@/components/productsCard/Card";

interface ProductsProps {
  params: {
    category: string;
  };
}

const Products = async ({ params }: ProductsProps) => {
  const { category } = params;
  const products = await getProductsByCategoryOrName(category);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold text-center mb-6">Our Products</h1>
      <div className="flex flex-wrap justify-center">
        {products.length > 0 ? (
          <Card
            products={products} 
            onProductSelect={() => {}} 
            isUserLoggedIn={false} 
          />
        ) : (
          <div className="text-gray-500">Products not found</div>
        )}
      </div>
    </div>
  );
};

export default Products;
