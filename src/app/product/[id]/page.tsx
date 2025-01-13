"use client";
import React, { useState, useEffect, useContext } from "react";
import DetailCard from "@/components/detailCard/DetailCard";
import { IProducts } from "@/interfaces/IProducts";
import { Toaster } from "react-hot-toast";
import { getProductById } from "@/app/api/getProducts";
import AddToCart from "@/components/AddToCart";
import { UserContext } from "@/context/UserContext";
import Link from "next/link";
import { useParams } from "next/navigation";

const Detail = () => {
  const { id } = useParams(); // Obtenemos el id del parámetro

  const [product, setProduct] = useState<IProducts | null>(null);
  const [rating, setRating] = useState<number>(0);

  const user = useContext(UserContext);
  const isUserLoggedIn = Boolean(user);

  // Efecto para obtener un producto específico basado en el ID
  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          // Aseguramos que id es un string antes de pasarlo a la función
          const fetchedProduct = await getProductById(id as string); // Uso de aserción de tipo
          setProduct(fetchedProduct);
        } catch (error) {
          console.error("Failed to fetch product:", error);
        }
      }
    };

    fetchProduct();
  }, [id]);

  // Mostrar mensaje si no se encuentra el producto
  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-500">Product not found</h1>
      </div>
    );
  }

  const currentDate = new Date();
  const deadline = new Date("2025-01-01");

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-black">
      {/* Banner navideño */}
      {currentDate < deadline && (
        <div
          className="relative w-full py-20"
          style={{
            backgroundImage: "url('/bannerSanta.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            height: "400px",
          }}
        ></div>
      )}

      <div className="flex w-full max-w-7xl px-4 py-10 space-x-8">
        {/* Detalle del producto */}
        <div className="flex-1 bg-black shadow-lg rounded-lg p-6">
          <DetailCard
            key={product.id}
            id={product.id}
            name={product.name}
            imgUrl={product.imgUrl}
            price={product.price}
            stock={product.stock}
            description={product.description}
            category={product.category}
          />

          <AddToCart product={product} isUserLoggedIn={isUserLoggedIn} />

          {/* Calificación por estrellas */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-white mb-4">Rate this product</h3>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-3xl ${
                    star <= rating ? "text-yellow-400" : "text-gray-500"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            <p className="mt-2 text-white">{`Your rating: ${rating} star${
              rating !== 1 ? "s" : ""
            }`}</p>
          </div>
        </div>

        {/* Sección de planes de entrenamiento */}
        <div className="lg:w-1/4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-3">
            Transform your body with our training plans!
          </h2>
          <p className="text-base mb-4">
            Join our personalized training plans to reach your goals. Whether
            you are looking to increase strength, flexibility, or overall
            wellness, we have the perfect plan for you.
          </p>
          <Link href="/membership">
            <button className="w-full px-4 py-2 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-600">
              Explore the plans!
            </button>
          </Link>
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default Detail;