import { toast } from "react-hot-toast";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchGyms() {
  try {
    const res = await fetch(`${APIURL}/gyms`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Error fetching gyms");
    }

    const data = await res.json();
    toast.success("Gyms fetched successfully!");
    return data; 
  }  catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    toast.error(errorMessage || "Failed to fetch gyms.");
    return null;
  }
}


//obtener el token 
function getTokenFromCookies() {
  const cookies = document.cookie.split("; ");
  const loginDataCookie = cookies.find(cookie => cookie.startsWith("loginData="));


  if (!loginDataCookie) return null;


  const cookieValue = loginDataCookie.split("=")[1];
  const loginData = JSON.parse(decodeURIComponent(cookieValue));


  return loginData.token || null;
}

export async function toggleGym(gymId: string) {
  const token = getTokenFromCookies();

  if (!token) {
    toast.error("No token found in cookies");
    return null;
  }


  try {
    const res = await fetch(`${APIURL}/gyms/toggle-status/${gymId}`, {
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
    toast.success("Gym status updated successfully!");
    return data;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    toast.error(errorMessage || "Failed to update gym status.");
    return null;
  }
}

export default fetchGyms;


