'use client';

import { getProductsByCategoryOrName } from '@/app/api/getProducts';
import Card from '@/components/productsCard/Card';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

const Products: React.FC = () => {
  const { category } = useParams(); // Accede a los parámetros de la ruta
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (category) {
        // Si category es un arreglo, toma el primer elemento
        const categoryString = Array.isArray(category) ? category[0] : category;
        const fetchedProducts = await getProductsByCategoryOrName(categoryString);
        setProducts(fetchedProducts);
      }
    };
    fetchProducts();
  }, [category]);

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
