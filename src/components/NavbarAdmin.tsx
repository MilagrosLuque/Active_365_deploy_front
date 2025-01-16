import { UserContext } from "@/context/UserContext";
import Link from "next/link";
import { useContext } from "react";


const NavbarAdmin: React.FC = () => {
  const { handleLogout } = useContext(UserContext);

  return (
    <>
      <Link href="/dashboardAdmin" className="btn">
        Dashboard Admin 
      </Link>

      <button onClick={handleLogout} className="btn">
        Logout
      </button>
    </>
  );
};

export default NavbarAdmin;
