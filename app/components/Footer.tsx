
import { FaHeart } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="w-full py-6 flex items-center justify-center gap-2 text-gray-500 text-sm mt-auto">
            <span>Made with</span>
            <FaHeart className="text-error animate-pulse" />
            <span>by Hridaya</span>
        </footer>
    );
};

export default Footer;
