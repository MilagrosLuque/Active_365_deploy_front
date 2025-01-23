"use client";

import { useContext, useState, useEffect } from "react";
import { UserContext } from "@/context/UserContext";

const ProfileSection: React.FC = () => {
  const { userSession } = useContext(UserContext);
  const [profilePic, setProfilePic] = useState<string>("https://via.placeholder.com/150");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({
    //id: "",
    name: "",
    phone: "",
    address: "",
    email: "",
    city: "",
    height: "",
    weight: "",
  });

  // Actualizar userData con la información del userSession
  useEffect(() => {
    if (userSession && userSession.user) {
      setUserData({
        //id: userSession.user.id || "",
        name: userSession.user.name || "",
        phone: userSession.user.phone || "",
        address: userSession.user.address || "",
        email: userSession.user.email || "",
        city: userSession.user.city || "",
        //height: userSession.user.height || "",//linea con error deploy
        //weight: userSession.user.weight || "",//linea con error 
        height: userSession.user.height ? userSession.user.height.toString() : "", // Conversión a string
        weight: userSession.user.weight ? userSession.user.weight.toString() : "", // Conversión a string
      });
    }
  }, [userSession]);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setProfilePic(imageUrl);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = () => {
    // Lógica para enviar los datos actualizados al backend
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">Profile</h2>
        <div className="flex items-center gap-6">
          <img
            src={profilePic}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-yellow-500"
          />
          <div>
            {/*<p className="text-lg text-gray-700"><strong>Id:</strong> {userData.id} </p>*/}
            <p className="text-lg text-gray-700"><strong>Name:</strong> {userData.name} </p>
            <p className="text-lg text-gray-700"><strong>Phone:</strong> {userData.phone}</p>
            <p className="text-lg text-gray-700"><strong>Address:</strong> {userData.address}</p>
            <p className="text-lg text-gray-700"><strong>Email:</strong> {userData.email}</p>
            <p className="text-lg text-gray-700"><strong>City:</strong> {userData.city}</p>
            <p className="text-lg text-gray-700"><strong>Height:</strong> {userData.height} cm</p>
            <p className="text-lg text-gray-700"><strong>Weight:</strong> {userData.weight} kg</p>

            <label htmlFor="profile-pic" className="inline-block mt-4 btn">
              Change Photo
            </label>
            <input
              id="profile-pic"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleProfilePicChange}
            />
            <button onClick={() => setIsModalOpen(true)} className="ml-4 btn">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
            <form>
              {Object.keys(userData).map((key) => (
                <div key={key} className="mb-4">
                  <label
                    htmlFor={key}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  <input
                    id={key}
                    name={key}
                    type="text"
                    value={userData[key as keyof typeof userData]}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                  />
                </div>
              ))}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileSection;
