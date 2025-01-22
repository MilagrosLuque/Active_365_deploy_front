"use client";
import { useState } from "react";
import { addProduct } from "@/app/api/getProducts"; 
import { CategoryName } from "@/interfaces/IProducts";

const AddProductForm: React.FC = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData = { 
        id: 0,  // Valor ficticio, será reemplazado por el backend
        name, 
        category: category as CategoryName, 
        price, 
        stock, 
        description 
    };
    const result = await addProduct(productData);
    if (result.success) {
        setSuccess("Product added successfully!");
        setName("");
        setCategory("");
        setPrice(0);
        setStock(0);
        setDescription("");
    }
};

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow-md rounded-lg mb-6">
      <h3 className="text-xl font-semibold mb-4">Add New Product</h3>
      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
        required
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        className="w-full mb-2 p-2 border rounded"
        required
      />
      <input
        type="number"
        placeholder="Stock"
        value={stock}
        onChange={(e) => setStock(Number(e.target.value))}
        className="w-full mb-2 p-2 border rounded"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
        required
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Add Product
      </button>
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </form>
  );
};

export default AddProductForm;
