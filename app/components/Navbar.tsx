import { Link } from "react-router";

const Navbar = () => {
    return (
        <nav className="navbar bg-indigo-100">
            <Link to="/">
                <p className="text-2xl bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent font-bold">CVlyser</p>
            </Link>
            <Link to="/upload" className="primary-button w-fit">
                Upload CV
            </Link>
        </nav>
    )
}
export default Navbar
