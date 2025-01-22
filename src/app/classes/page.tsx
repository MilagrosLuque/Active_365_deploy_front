/*"use client"
import { UserContext } from '@/context/UserContext';
import React, { useState, useEffect, useContext } from 'react';

// Obtener el token de las cookies
function getTokenFromCookies() {
  const cookies = document.cookie.split("; ");
  const loginDataCookie = cookies.find(cookie => cookie.startsWith("loginData="));

  if (!loginDataCookie) return null;

  const cookieValue = loginDataCookie.split("=")[1];
  const loginData = JSON.parse(decodeURIComponent(cookieValue));

  return loginData.token || null;
}

const Classes: React.FC<{
  name: string;
  gymId: string;
}> = ({ name, gymId }) => {
  
  const [classes, setClasses] = useState<{ id: string; name: string; time: string }[]>([]);
  const [userAppointments, setUserAppointments] = useState<{ classId: string; time: string; gymId: string }[]>([]);
  const [loadingClasses, setLoadingClasses] = useState<boolean>(true);
  const [errorClasses, setErrorClasses] = useState<string | null>(null);
  
  const { userSession } = useContext(UserContext);
  const userId = userSession?.user?.id; // Obtener userId del contexto
  const token = getTokenFromCookies(); // Obtener el token de las cookies

  // Cargar las clases y las citas del usuario al montar el componente
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/classes?gymId=${gymId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Agregar token en los encabezados
          },
        });
        if (!response.ok) throw new Error('Error fetching classes');
        const data = await response.json();
        setClasses(data);
      } catch {
        setErrorClasses('Failed to load classes');
      } finally {
        setLoadingClasses(false);
      }
    };

    const fetchAppointments = async () => {
      if (!userId) return; // Validar si userId está disponible
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Agregar token en los encabezados
          },
        });
        if (!response.ok) throw new Error('Error fetching appointments');
        const data = await response.json();
        setUserAppointments(data);
      } catch {
        console.error('Failed to load appointments');
      }
    };

    fetchClasses();
    fetchAppointments();
  }, [gymId, userId, token]);

  // Función para agendar una cita
  const handleScheduleAppointment = async (classId: string, classTime: string) => {
    if (!userId) {
      alert('User ID is required to schedule an appointment.');
      return;
    }

    // Validación: Si el usuario ya tiene una cita en la misma hora y gimnasio
    const hasAppointment = userAppointments.some(
      (appointment) => appointment.gymId === gymId && appointment.time === classTime
    );

    if (hasAppointment) {
      alert('You already have an appointment at this time and gym.');
      return;
    }

    const appointmentData = {
      userId: userId,
      classId: classId,
      time: classTime,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Agregar token en los encabezados
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        let errorDetails: { message: string } = { message: 'Failed to schedule appointment' };
        try {
          errorDetails = await response.json();
        } catch {
          // Si no podemos obtener detalles, mantenemos el mensaje por defecto
        }
        console.error('Error details:', errorDetails);
        throw new Error(errorDetails.message);
      }

      alert('Appointment scheduled successfully!');
      setUserAppointments((prev) => [...prev, { gymId, classId, time: classTime }]);
    } catch (error: unknown) { // Utilizar unknown
      if (error instanceof Error) {
        alert('Failed to schedule appointment: ' + error.message);
      } else {
        alert('Failed to schedule appointment: Unknown error');
      }
    }
  };

  return (
    <div className="max-w-sm mx-auto mb-8 bg-yellow-300 rounded-lg shadow-lg p-6">
      
      <div className="bg-yellow-500 text-white text-xl font-bold text-center p-4 rounded-t-lg">
        {name}
      </div>

      
      <div className="mt-4 p-4 bg-yellow-200 rounded-lg border border-gray-300">
        <h3 className="text-sm font-semibold text-gray-800">Classes:</h3>
        {loadingClasses ? (
          <p className="text-gray-600">Loading classes...</p>
        ) : errorClasses ? (
          <p className="text-red-500">{errorClasses}</p>
        ) : classes.length > 0 ? (
          <ul className="list-disc pl-5">
            {classes.map((cls) => (
              <li key={cls.id} className="text-gray-700">
                {cls.name} - {cls.time}
                <button
                  onClick={() => handleScheduleAppointment(cls.id, cls.time)}
                  className="ml-4 py-1 px-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
                >
                  Schedule an Appointment
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No classes available</p>
        )}
      </div>
    </div>
  );
};

const About: React.FC = () => {
  const [gyms, setGyms] = useState<{
    id: string;
    name: string;
  }[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const token = getTokenFromCookies(); // Obtener el token de las cookies

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Gyms`, {
          headers: {
            Authorization: `Bearer ${token}`, // Agregar token en los encabezados
          },
        });
        if (!response.ok) throw new Error('Error fetching gyms');
        const data = await response.json();
        setGyms(data);
      } catch {
        console.error('Failed to load gyms');
      } finally {
        setLoading(false);
      }
    };

    fetchGyms();
  }, [token]);

  if (loading) return <div className="text-center py-4">Loading...</div>;

  if (!gyms || gyms.length === 0)
    return <div className="text-center py-4">No gyms found</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold text-center mb-6">Our Gym Classes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {gyms.map((gym) => (
          
          <Classes key={gym.id} gymId={gym.id} name={gym.name} />
        ))}
      </div>
    </div>
  );
};

export default About;*/



