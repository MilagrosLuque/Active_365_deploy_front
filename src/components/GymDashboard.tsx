"use client";

import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "@/context/UserContext";


type GymClass = {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
};

const GymDashboard: React.FC = () => {
  const userSession = useContext(UserContext);
    
  const [gymClasses, setGymClasses] = useState<GymClass[]>([]);
  const [isClassSectionOpen, setIsClassSectionOpen] = useState(false);
  const [newClass, setNewClass] = useState({ name: "", description: "" });
  //const gymId = userSession.userSession?.data?.gym
  //puse esta linea para que no rompa el deploy porque no existe la propiedad data en userSession y se rompia
  const gymId = userSession.userSession
  const APIURL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchGymClasses = async () => {
      try {
        const response = await fetch(`${APIURL}/gyms/${gymId}/classes`);
        if (!response.ok) {
          throw new Error("Failed to fetch gym classes");
        }
        const data: GymClass[] = await response.json();
        setGymClasses(data);
      } catch (error) {
        console.error("Error fetching gym classes:", error);
      }
    };

    fetchGymClasses();
  }, [APIURL, gymId]);

  const handleClassToggle = async (classId: string) => {
    try {
      const response = await fetch(`${APIURL}/gyms/classes/${classId}/toggle-status`, {
        method: "PUT",
      });
      if (!response.ok) {
        throw new Error("Failed to toggle class status");
      }
      setGymClasses((prevClasses) =>
        prevClasses.map((cls) =>
          cls.id === classId ? { ...cls, status: cls.status === "active" ? "inactive" : "active" } : cls
        )
      );
    } catch (error) {
      console.error("Error toggling class status:", error);
    }
  };

  const handleNewClassChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewClass((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddClass = async () => {
    try {
      const response = await fetch(`${APIURL}/gyms/${gymId}/classes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newClass),
      });
      if (!response.ok) {
        throw new Error("Failed to add new class");
      }
      const data: GymClass = await response.json();
      setGymClasses((prevClasses) => [...prevClasses, data]);
      setNewClass({ name: "", description: "" });
    } catch (error) {
      console.error("Error adding new class:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-700">Gym Dashboard</h1>

      <div className="bg-white rounded-lg shadow-md mb-6">
        <button
          onClick={() => setIsClassSectionOpen(!isClassSectionOpen)}
          className="w-full text-left px-6 py-4 text-2xl font-semibold text-black bg-yellow-400 hover:bg-yellow-500 transition"
        >
          Manage Classes
        </button>
        {isClassSectionOpen && (
          <div className="px-6 py-4">
            <h2 className="text-xl font-bold mb-4">Classes</h2>
            <ul className="mb-4">
              {gymClasses.map((cls) => (
                <li key={cls.id} className="flex justify-between items-center mb-2">
                  <span>{cls.name} ({cls.status})</span>
                  <button
                    onClick={() => handleClassToggle(cls.id)}
                    className="text-sm text-black bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500"
                  >
                    {cls.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                </li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold mb-2">Add New Class</h3>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                name="name"
                value={newClass.name}
                onChange={handleNewClassChange}
                placeholder="Class Name"
                className="border rounded px-4 py-2"
              />
              <textarea
                name="description"
                value={newClass.description}
                onChange={handleNewClassChange}
                placeholder="Class Description"
                className="border rounded px-4 py-2"
              ></textarea>
              <button
                onClick={handleAddClass}
                className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500"
              >
                Add Class
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GymDashboard;