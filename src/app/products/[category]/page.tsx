import { getProductsByCategoryOrName } from '@/app/api/getProducts';
import Card from '@/components/productsCard/Card';
import { Metadata } from 'next';
import React from 'react';

// Definimos el tipo para los parámetros dinámicos
type PageProps = {
  params: {
    category: string;
  };
};

// Definir el metadata opcional
export const metadata: Metadata = {
  title: 'Products Page',
};

const Products: React.FC<PageProps> = async ({ params }) => {
  const { category } = params;
  const products = await getProductsByCategoryOrName(category);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold text-center mb-6">Our Products</h1>
      <div className="flex flex-wrap justify-center">
        {products.length ? (
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
