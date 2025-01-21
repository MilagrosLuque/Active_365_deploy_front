"use client";
import {  useEffect, useState } from "react";
import fetchGyms, { toggleGym } from "../api/GymsAPI";
import { getProductById, getProducts, toggleProduct, updateProduct } from "../api/getProducts";
import { CategoryName, IProducts } from "@/interfaces/IProducts";
import { getUsers, setAdmin, toggleUser } from "../api/getUsers";
import AddProductForm from "@/components/AddProductForm";
import toast from "react-hot-toast";


//import { IUserSession } from "@/interfaces/ILogin";
//import { IGym } from "@/interfaces/IGym";


const DashboardAdmin: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, gyms, and products</p>
        </header>


        {/* Overview Section <OverviewSection />*/}
        {/* Sections */}
        <GymsSection />
        <ProductsSection />
        <UsersSection />
      </div>
    </div>
  );
};


/*const OverviewSection: React.FC = () => {
  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Users", count: 350 },
          { title: "Active Products", count: 120 },
          { title: "Active Gyms", count: 15 },
          { title: "Other Data", count: 45 },
        ].map((item, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700">{item.title}</h2>
            <p className="text-3xl font-bold text-gray-900">{item.count}</p>
          </div>
        ))}
      </div>
    </section>
  );
};*/


const GymsSection: React.FC = () => {
  const [gyms, setGyms] = useState<{ id: number; name: string; status: string }[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadGyms = async () => {
      setLoading(true);
      const data = await fetchGyms();
      if (data) {
        setGyms(data);
      } else {
        setError("Failed to load gyms.");
      }
      setLoading(false);
    };
    loadGyms();
  }, []);

  const displayedGyms = showAll ? gyms : gyms.slice(0, 3);

  // Nueva función para alternar el estado
  const handleToggleGymStatus = async (gymId: number) => {
    const updatedGym = await toggleGym(gymId.toString());
    if (updatedGym) {
      setGyms((prevGyms) =>
        prevGyms.map((gym) =>
          gym.id === gymId ? { ...gym, status: gym.status === "active" ? "inactive" : "active" } : gym
        )
      );
    } else {
      toast.error("Failed to toggle gym status.");
    }
  };

  if (loading) return <p>Loading gyms...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <SectionTable
      title="Gyms"
      data={displayedGyms}
      columns={["ID", "Name", "Status", "Actions"]}
      showAll={showAll}
      toggleShow={() => setShowAll(!showAll)}
      fullDataLength={gyms.length}
      renderActions={(gym) => (
        <button
          onClick={() => handleToggleGymStatus(gym.id)}
          className={`px-4 py-2 text-white font-semibold rounded ${
            gym.status === "active" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {gym.status === "active" ? "Deactivate" : "Activate"}
        </button>
      )}
    />
  );
};


const ProductsSection: React.FC = () => {
  const [products, setProducts] = useState<IProducts[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<IProducts | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts();
        setProducts(data);
      } catch {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleToggleProductStatus = async (productId: number) => {
    try {
      const updatedProduct = await toggleProduct(productId.toString());
      if (updatedProduct) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === productId
              ? { ...product, status: product.status === "active" ? "inactive" : "active" }
              : product
          )
        );
        toast.success("Product status updated successfully!");
      }
    } catch {
      toast.error("Failed to toggle product status.");
    }
  };

  const displayedProducts = showAll ? products : products.slice(0, 3);
  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleProductUpdate = async (updatedProduct: IProducts) => {
    try {
      if (!updatedProduct.id) {
        throw new Error("Product ID is required to update the product.");
      }
  
      const updatedData = await updateProduct(updatedProduct.id.toString(), updatedProduct); // Convertir a string
      if (updatedData) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === updatedData.id ? updatedData : product
          )
        );
        toast.success("Product updated successfully!");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product. Please try again.");
    } finally {
      setIsModalOpen(false);
      setIsEditing(false);
    }
  };

  const fetchProductDetails = async (id: number) => {
    try {
      const productDetails = await getProductById(id.toString());
      setSelectedProduct(productDetails);
      setIsModalOpen(true);
      setIsEditing(false);
    } catch (err) {
      console.error("Error fetching product details", err);
    }
  };

  return (
    <>
      <AddProductForm />
      <SectionTable
        title="Products"
        data={displayedProducts}
        columns={["ID", "Name", "Status", "Actions"]}
        showAll={showAll}
        toggleShow={() => setShowAll(!showAll)}
        fullDataLength={products.length}
        renderActions={(product) => (
          <div className="flex gap-2">
            <button
              onClick={() => fetchProductDetails(product.id)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              View Details
            </button>
            <button
              onClick={() => handleToggleProductStatus(product.id)}
              className={`px-4 py-2 text-white font-semibold rounded ${
                product.status === "active"
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {product.status === "active" ? "Deactivate" : "Activate"}
            </button>
          </div>
        )}
      />
        {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Product Details</h2>
            {isEditing ? (
              <form>
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium">ID</label>
                    <input
                      type="text"
                      value={selectedProduct.id}
                      disabled
                      className="w-full border rounded px-2 py-1 bg-gray-100"
                    />
                  </div>
                  {Object.entries(selectedProduct).map(([key, value]) => {
                    if (key === "id" || key === "reviews" || key === "status") return null;

                    if (key === "category") {
                      return (
                        <div key={key}>
                          <label htmlFor={key} className="block font-medium">
                            Category
                          </label>
                          <select
                            id={key}
                            name={key}
                            value={value}
                            onChange={(e) =>
                              setSelectedProduct((prev) =>//linea 262 donde empieza el error
                                prev
                                  ? {
                                      ...prev,
                                      [key]: e.target.value as CategoryName,
                                    }
                                  : null
                              )
                            }
                            className="w-full border rounded px-2 py-1"
                          >
                            <option value="" disabled>Select a category</option>
                            <option value="Nutritional Supplements">Nutritional Supplements</option>
                            <option value="Training Accessories">Training Accessories</option>
                            <option value="Sports Apparel">Sports Apparel</option>
                            <option value="Home Equipment">Home Equipment</option>
                            <option value="Health & Wellness">Health & Wellness</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      );
                    }

                    return (
                      <div key={key}>
                        <label htmlFor={key} className="block font-medium">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </label>
                        <input
                          type="text"
                          id={key}
                          name={key}
                          value={String(value)}
                          onChange={(e) =>
                            setSelectedProduct((prev) =>
                              prev ? { ...prev, [key]: e.target.value } : null
                            )
                          }
                          className="w-full border rounded px-2 py-1"
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    type="button"
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
  onClick={() => selectedProduct && handleProductUpdate(selectedProduct)}
  type="button"
  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
>
  Save
</button>
                </div>
              </form>
            ) : (
              <>
                <p><strong>ID:</strong> {selectedProduct.id}</p>
                <p><strong>Name:</strong> {selectedProduct.name}</p>
                <p><strong>Description:</strong> {selectedProduct.description}</p>
                <p><strong>Price:</strong> ${selectedProduct.price}</p>
                <p><strong>Stock:</strong> {selectedProduct.stock}</p>
                <p><strong>Category:</strong> {selectedProduct.category}</p>
                <p><strong>Subcategory:</strong> {selectedProduct.subcategory || "N/A"}</p>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Edit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const UsersSection: React.FC = () => {
  const [users, setUsers] = useState<unknown[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers || []);
      } catch {
        setError("Error fetching users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleChangeStatus = async (id: string) => {
    try {
      const updatedUser = await toggleUser(id);
      if (updatedUser) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === id ? { ...user, status: updatedUser.status } : user
          )
        );
        toast.success(`User status updated to ${updatedUser.status}`);
      } else {
        throw new Error("User status update failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to toggle user status.");
    }
  };

  const handleSetAdmin = async (id: string) => {
    try {
      const updatedUser = await setAdmin(id);
      if (updatedUser) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === id ? { ...user, rol: "admin" } : user
          )
        );
        toast.success("User promoted to admin successfully!");
      } else {
        throw new Error("Failed to promote user to admin");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to promote user to admin.");
    }
  };

  return (
    <SectionTable
      title="Users"
      data={users.map((user) => ({
        id: user.id,
        email: user.email,
        rol: user.rol,
        status: user.status,
      }))}
      columns={["ID", "Email", "Rol", "Status", "Actions"]}
      showAll={false}
      toggleShow={() => {}}
      fullDataLength={users.length}
      renderActions={(user) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleChangeStatus(user.id, user.status)}
            className={`px-4 py-2 text-white font-semibold rounded ${
              user.status === "active"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {user.status === "active" ? "Deactivate" : "Activate"}
          </button>
          <button
            onClick={() => handleSetAdmin(user.id)}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
          >
            Make Admin
          </button>
        </div>
      )}
    />
  );
};



interface SectionTableProps {
  title: string;
  //data: IGym[] | IProducts[] | IUserSession[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]
  columns: string[];
  showAll: boolean;
  toggleShow: () => void;
  fullDataLength: number;
  renderActions?: (item: { id: number; name: string; status: string }) => React.ReactNode;
}


const SectionTable: React.FC<SectionTableProps> = ({
  title,
  data,
  columns,
  showAll,
  toggleShow,
  fullDataLength,
  renderActions,
}) => {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
      <div className="bg-white shadow-md rounded-lg p-4">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
              {columns.map((col, index) => (
                <th key={index} className="px-4 py-2">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id || index} className="bg-white border-b text-gray-700">
                {columns.map((col) => {
                  if (col.toLowerCase() === "actions" && renderActions) {
                    return (
                      <td key={`${col}-${item.id}`} className="px-4 py-2">
                        {renderActions(item)}
                      </td>
                    );
                  }
                  // Para las demás columnas, mapeamos dinámicamente las propiedades del objeto
                  const value = item[col.toLowerCase()];
                  return (
                    <td key={`${col}-${item.id}`} className="px-4 py-2">
                      {value !== undefined ? value : "-"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {fullDataLength > 3 && (
          <button
            onClick={toggleShow}
            className="mt-4 text-blue-500 hover:underline"
          >
            {showAll ? "Show less" : "View all"}
          </button>
        )}
      </div>
    </section>
  );
};

export default DashboardAdmin;