import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

function NavigationBar(){
    return(
        <div className="navigation_bar">
            <nav className="navbar">
                <ul className="nav_menu">
                    <li className="nav_brand"><Link to="/">DEV@Deakin</Link></li>
                    <li className="nav_search">
                        <FaSearch className="search_icon" />
                        <input type="text" placeholder="Search..." />
                    </li>
                    <li><a href="#">Post</a></li>
                    <li><Link to="/login">Login</Link></li>
                </ul>
            </nav>
        </div>
    )
}

export default NavigationBar