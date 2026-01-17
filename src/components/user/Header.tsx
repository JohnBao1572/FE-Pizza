import { Dropdown, Badge } from "antd";
import {
    ShoppingCartOutlined,
    SearchOutlined,
    UserOutlined,
    GlobalOutlined,
} from "@ant-design/icons";
import { localDataNames } from "../../constants/appInfos";
import { useDispatch, useSelector } from "react-redux";
import { authSelector, removeAuth } from "../../reduxs/reducers/authReducer";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../apis/axiosClient";

const Header = () => {
    const auth = useSelector(authSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem(localDataNames.authData);
        dispatch(removeAuth());
        delete axiosClient.defaults.headers.common['Authorization'];
        navigate('/login');
    };

    const items = auth?.accessToken ? [
        { key: "profile", label: <Link to="/profile">Profile</Link> },
        { key: "logout", label: <span onClick={handleLogout}>Log Out</span> },
    ] : [
        { key: "login", label: <Link to="/login">Login</Link> },
        { key: "register", label: <Link to="/SignUp">SignUp</Link> },
    ];

    return (
        <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
            <div className="container mx-auto flex items-center px-4 py-3 justify-between">
                {/* Logo */}
                <div className="flex items-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Domino%27s_pizza_logo.svg/960px-Domino%27s_pizza_logo.svg.png" alt="Pizza Hut Logo" className="h-10 mr-4" />
                    <span>Bao's Pizza</span>
                </div>

                {/* Navigation */}
                <nav className="hidden lg:flex space-x-6">
                    {["Combo", "Pizza", "Chicken", "Drinks", "Deals"].map((item) => (
                        <a key={item} className="text-gray-700 hover:text-red-600">
                            {item}
                        </a>
                    ))}
                </nav>

                {/* Action Icons */}
                <div className="flex items-center space-x-4">
                    <SearchOutlined className="text-xl text-gray-700 hover:text-red-500" />

                    <Badge count={3}>
                        <ShoppingCartOutlined className="text-xl text-gray-700 hover:text-red-500" />
                    </Badge>

                    <Dropdown menu={{ items }} trigger={['click']}>
                        <UserOutlined className="text-xl text-gray-700 hover:text-red-500 cursor-pointer" />
                    </Dropdown>

                    <Dropdown
                        menu={{
                            items: [
                                { key: "vi", label: "Tiếng Việt" },
                                { key: "en", label: "English" },
                            ],
                        }}
                    >
                        <GlobalOutlined className="text-xl text-gray-700 cursor-pointer" />
                    </Dropdown>
                </div>
            </div>
        </header>
    );
};

export default Header;
