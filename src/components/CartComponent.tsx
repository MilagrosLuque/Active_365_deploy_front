"use client"
import React, { useContext, useState } from "react";
import { GeneralContext } from "@/context/GeneralContext";
import Link from "next/link";
import { UserContext } from "@/context/UserContext";
import { getTokenFromCookies } from "@/app/api/getUsers";

const CartComponent: React.FC = () => {

    const { userSession } = useContext(UserContext)
    const { removeFromCart, clearCart } = useContext(GeneralContext);

    const { cart }= useContext(GeneralContext);
    //lo comente porque no se estaba usando user
    //const user = useContext(UserContext);
    const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
    const isMember = true;
    const shippingCost = isMember ? 0 : 10;

    /*const totalProductsPrice = cart.reduce((total, item) => {
        const quantity = quantities[item.id] || 1;//linea con el error
        return total + item.price * quantity;//linea con el error
    }, 0);*/

    //nuevo codigo para deploy
    const totalProductsPrice = cart.reduce((total, item) => {
        const quantity = quantities[item.id] || 1;
        const price = item.price ?? 0;
        return total + price * quantity;
    }, 0);
    

    const totalPrice = totalProductsPrice + shippingCost;

    const createOrder = async () => {
        const APIURL = process.env.NEXT_PUBLIC_API_URL;
        const userId = userSession?.user.id;
        const token = getTokenFromCookies();

        console.log("userId:", userId);
        console.log("token:", token);
        console.log("cart:", cart);

        if (!cart || cart.length === 0 || !token) {
            throw new Error("El carrito está vacío o el token no es válido.");
        }

        if (!userId || !token || !APIURL) {
            console.error("Missing data: userId, token, or API URL.");
            return null;
        }

        try {
            const response = await fetch(`${APIURL}/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId,
                    products: cart.map(item => ({
                        productId: item.id,
                        quantity: quantities[item.id] || 1,//linea con error
                    })),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error response from server:", errorData);
                throw new Error("Failed to create order");
            }

            const order = await response.json();
            console.log("Order created:", order);
            return order.id;

        } catch (error) {
            console.error("Error creating order:", error);
            return null;
        }
    };


    const handleCheckout = async () => {
        const APIURL = process.env.NEXT_PUBLIC_API_URL;
        const orderId = await createOrder();
        console.log("orderId:", orderId);
        if (orderId) {
            try {
                const response = await fetch(`${APIURL}/checkout/${orderId}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch Stripe session");
                }
                const { url } = await response.json();
                window.location.href = url;
            } catch (error) {
                console.error("Error in Stripe checkout:", error);
                alert("Error al procesar el pago. Inténtalo nuevamente.");
            }
        } else {
            alert("Error al crear la orden. Inténtalo nuevamente.");
        }
    }

        return (
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
                <div className="space-y-4">
                    {cart.map((item) => (
                        <div key={item.id} className="flex items-start justify-between border-b pb-4">
                            <img
                                src={item.imgUrl}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-md"
                            />
                            <div className="flex-grow ml-4">
                                <p className="text-lg font-semibold text-gray-800">{item.name}</p>
                                <div className="flex items-center space-x-2 mt-2">
                                    <p className="text-lg text-black">${item.price}</p>
                                </div>
                                <p className="text-sm text-gray-500">{item.stock} stock</p>
                                <div className="flex items-center mt-2">
                                    <button
                                        onClick={() => {
                                            const currentQty = quantities[item.id] || 1;//linea con error
                                            if (currentQty > 1) {
                                                setQuantities({
                                                    ...quantities,
                                                    [item.id]: currentQty - 1,//linea con error
                                                });
                                            }
                                        }}
                                        className="px-2 py-1 bg-yellow-400 text-white rounded-md hover:bg-yellow-500"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={quantities[item.id] || 1}//linea con error
                                        onChange={(e) =>
                                            setQuantities({
                                                ...quantities,
                                                [item.id]: Math.max(//linea con error
                                                    1,
                                                    Math.min(parseInt(e.target.value, 10) || 1, item.stock)//linea con error
                                                ),
                                            })
                                        }
                                        className="w-12 text-center mx-2 p-1 border border-gray-300 rounded-md text-black"
                                    />
                                    <button
                                        onClick={() => {
                                            const currentQty = quantities[item.id] || 1;//linea con error
                                            if (currentQty < item.stock) {//linea con error
                                                setQuantities({
                                                    ...quantities,
                                                    [item.id]: currentQty + 1,//linea con error
                                                });
                                            }
                                        }}
                                        className="px-2 py-1 bg-yellow-400 text-white rounded-md hover:bg-yellow-500"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={() => removeFromCart(item.id.toString())}//linea con error
                                className="ml-4 text-red-600 hover:text-red-700 text-sm flex items-center space-x-1"
                            >
                                <span>Delete</span>
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-6 border-t pt-4">
                    <div className="flex justify-between text-gray-800">
                        <p>Products ({cart.length})</p>
                        <p>${totalProductsPrice}</p>
                    </div>
                    <div className="flex justify-between text-gray-800">
                        <p>Shipping Cost</p>
                        <p>${shippingCost}</p>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-900 mt-2">
                        <p>Total</p>
                        <p>${totalPrice}</p>
                    </div>
                </div>

                <div className="mt-6 flex justify-between">
                    <button
                        onClick={clearCart}
                        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                    >
                        Empty cart
                    </button>
                    <Link href="/products">
                        <button className="bg-yellow-400 text-white py-2 px-4 rounded-md hover:bg-yellow-500">
                            Continue Shopping
                        </button>
                    </Link>
                </div>

                <div className="mt-6 flex justify-center">
                    <button
                        onClick={handleCheckout}
                        className="bg-yellow-500 text-white py-2 px-6 rounded-md hover:bg-yellow-600"
                        disabled={cart.length === 0}
                    >
                        Checkout
                    </button>
                </div>
            </div>
        );
    };

    export default CartComponent;