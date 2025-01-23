import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/UserContext";
import { IAppointment } from "@/interfaces/ILogin";

const MyClasses: React.FC = () => {
  const { userSession } = useContext(UserContext);
  const [appointments, setAppointments] = useState<IAppointment[]>([]);

  useEffect(() => {
    if (userSession && userSession.user && userSession.user.appointments) {
      setAppointments(userSession.user.appointments);
    }
  }, [userSession]);

  return (
    <div className="p-6 bg-gray-50">
      <h2 className="text-2xl font-bold mb-6 text-center">My Classes</h2>
      {appointments.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="bg-white shadow-md border border-gray-200 rounded-lg p-4 hover:scale-105 transition-transform"
            >
              <h3 className="text-lg font-semibold mb-2">Class Appointment</h3>
              <p className="text-sm">
                <span className="font-bold">Status:</span> {appt.status}
              </p>
              <p className="text-sm">
                <span className="font-bold">Date:</span> {new Date(appt.date).toLocaleDateString()}
              </p>
              <p className="text-sm">
                <span className="font-bold">Time:</span> {appt.time}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No appointments found.</p>
      )}
    </div>
  );
};

export default MyClasses;
