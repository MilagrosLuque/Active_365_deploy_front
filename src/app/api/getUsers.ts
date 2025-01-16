import { toast } from "react-hot-toast";


const APIURL = process.env.NEXT_PUBLIC_API_URL;


export function getTokenFromCookies() {
  const cookies = document.cookie.split("; ");
  const loginDataCookie = cookies.find(cookie => cookie.startsWith("loginData="));


  if (!loginDataCookie) return null;


  const cookieValue = loginDataCookie.split("=")[1];
  const loginData = JSON.parse(decodeURIComponent(cookieValue));


  return loginData.token || null;
}


export async function getUsers() {
  const token = getTokenFromCookies();
 
  if (!token) {
    toast.error("No token found in cookies");
    return null;
  }


  try {
    const res = await fetch(`${APIURL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });


    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Error fetching users");
    }


    const data = await res.json();
    toast.success("Users fetched successfully!");
    return data;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    toast.error(errorMessage || "Failed to fetch users. Please try again.");
    return null;
  }
}


export async function toggleUser(userId: string) {
  const token = getTokenFromCookies();

  if (!token) {
    toast.error("No token found in cookies");
    return null;
  }


  try {
    const res = await fetch(`${APIURL}/users/toggle-status/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Error updating user status");
    }

    const data = await res.json();
    toast.success("User status updated successfully!");
    return data;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    toast.error(errorMessage || "Failed to update user status.");
    return null;
  }
}

export async function setAdmin(userId: string) {
    const token = getTokenFromCookies();
  
    if (!token) {
      toast.error("No token found in cookies");
      return null;
    }
  
    try {
      const res = await fetch(`${APIURL}/users/setadmin/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to assign admin role.");
      }
  
      const data = await res.json();
      toast.success("User successfully!");
      return data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errorMessage || "User has been successfully promoted to admin.");
      return null;
    }
}

export default getUsers;


