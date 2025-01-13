import { UserContext } from "@/context/UserContext";
import Link from "next/link";
import { useContext } from "react";
import { FaShoppingCart } from "react-icons/fa"; 

const NavbarAuth: React.FC = () => {
  const { handleLogout } = useContext(UserContext);

  return (
    <>
      <Link href="/dashboardUser" className="btn">
        Dashboard
      </Link>

      <button onClick={handleLogout} className="btn">
        Logout
      </button>

      <Link href="/cart" className="btn cart-icon">
        <FaShoppingCart size={20} /> 
      </Link>
    </>
  );
};

export default NavbarAuth;
