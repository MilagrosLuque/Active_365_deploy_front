'use client';

import { getProductsByCategoryOrName } from '@/app/api/getProducts';
import Card from '@/components/productsCard/Card';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { IProducts } from '@/interfaces/IProducts'; // Importa la interfaz IProducts

const Products: React.FC = () => {
  const { category } = useParams<{ category?: string }>() || {}; // Agregamos un fallback vacío {} para el caso de null
  const [products, setProducts] = useState<IProducts[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (category) {
        // Verificar que category no sea null o undefined
        const categoryString = Array.isArray(category) ? category[0] : category;
        const fetchedProducts = await getProductsByCategoryOrName(categoryString);
        setProducts(fetchedProducts);
      }
    };

    if (category) {
      fetchProducts();
    }
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
