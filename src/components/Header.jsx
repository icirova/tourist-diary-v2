import "./Header.scss";
import Navbar from "./Navbar";

const Header = () => {
    return <header className="header">
        <h1 className="logo">Turistický deník</h1>
        <Navbar />
    </header>
    
}

export default Header