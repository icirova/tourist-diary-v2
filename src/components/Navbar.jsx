import "./Navbar.css";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return <nav className="navbar">
      <NavLink to="/" className={ ({isActive}) => isActive ? "link link--active" : "link"}>Výlety</NavLink>
      <NavLink to="/" className={ ({isActive}) => isActive ? "link link--active" : "link"}>Vložit</NavLink>
  </nav>
};

export default Navbar;
