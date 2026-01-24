import { useState } from 'react';
import {
  FaBoxOpen,
  FaListUl,
  FaShoppingCart,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { FiSettings, FiHelpCircle } from "react-icons/fi";
import CategoryTable from '../../components/auth/category/CategoryTable';
import ProductTable from '../../components/auth/products/ProductTable';
import { localDataNames } from '../../constants/appInfos';
import { useDispatch } from 'react-redux';
import { removeAuth } from '../../reduxs/reducers/authReducer';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../apis/axiosClient';
import { MdDiscount } from 'react-icons/md';
import DiscountTable from '../../components/auth/discounts/DiscountTable';
import BillTable from '../../components/auth/bill/BillTable';

const Dashboard = () => {
  const [activeKey, setActiveKey] = useState('dashboard');

  const menuItems = [
    { icon: <FaBoxOpen />, label: 'Products', key: 'products' },
    { icon: <FaListUl />, label: 'Category', key: 'category' },
    { icon: <FaUser />, label: 'Users', key: 'users' },
    { icon: <FaShoppingCart />, label: 'Bills', key: 'bills' },
    { icon: <MdDiscount />, label: 'Discounts', key: 'discounts' },
  ];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem(localDataNames.authData);
    dispatch(removeAuth());
    delete axiosClient.defaults.headers.common['Authorization'];

    navigate('/auth/login');
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 flex overflow-hidden">
      {/* ================= Sidebar ================= */}
      <aside className="w-64 min-w-[256px] bg-white border-r flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b">
          <span className="text-xl font-bold text-gray-800">🍕 React Pizza</span>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          <div
            onClick={() => setActiveKey('dashboard')}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition
              ${activeKey === 'dashboard'
                ? 'bg-black text-white'
                : 'text-gray-600 hover:bg-gray-100'}
            `}
          >
            <span className="text-lg">🏠</span>
            <span className="font-medium">Dashboard</span>
          </div>

          {menuItems.map((item) => (
            <div
              key={item.key}
              onClick={() => setActiveKey(item.key)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition
                ${activeKey === item.key
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-gray-100'}
              `}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-4 py-4 border-t space-y-1">
          <div className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer">
            <FiHelpCircle />
            <span>Get Help</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer">
            <FiSettings />
            <span>Settings</span>
          </div>
          <div
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
          >
            <FaSignOutAlt />
            <span>Log out</span>
          </div>
        </div>
      </aside>

      {/* ================= Main Content ================= */}
      <div className="flex-1 w-full flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-gray-800 capitalize">
            {activeKey === 'dashboard' ? 'Dashboard' : activeKey}
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-gray-200" />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {activeKey === 'category' && (
            <div className="bg-white rounded-xl shadow p-6">
              <CategoryTable />
            </div>
          )}

          {activeKey === 'products' && (
            <div className="bg-white rounded-xl shadow p-6">
              <ProductTable />
            </div>
          )}

          {activeKey === 'bills' && (
            <div className="bg-white rounded-xl shadow p-6">
              <BillTable />
            </div>
          )}

          {activeKey === 'discounts' && (
            <div className="bg-white rounded-xl shadow p-6">
              <DiscountTable />
            </div>
          )}

          {activeKey !== 'category' && activeKey !== 'products' && activeKey !== 'dashboard' && activeKey !== 'discounts' && activeKey !== 'bills' && (
            <div className="bg-white rounded-xl shadow p-10 text-center">
              <h2 className="text-2xl font-bold mb-2">{activeKey}</h2>
              <p className="text-gray-500">Chức năng đang được phát triển...</p>
            </div>
          )}

          {activeKey === 'dashboard' && (
            <>
              {/* Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-6 rounded-xl shadow">
                  <p className="text-gray-500 text-sm">Revenue</p>
                  <h3 className="text-2xl font-bold mt-2">$116,925</h3>
                  <p className="text-green-500 text-sm mt-1">+7.4% since last month</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                  <p className="text-gray-500 text-sm">Orders</p>
                  <h3 className="text-2xl font-bold mt-2">24,645</h3>
                  <p className="text-green-500 text-sm mt-1">+1.08% since last month</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                  <p className="text-gray-500 text-sm">Customers</p>
                  <h3 className="text-2xl font-bold mt-2">16,125</h3>
                  <p className="text-green-500 text-sm mt-1">+4.47% since last month</p>
                </div>
              </div>

              {/* Big panel */}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Welcome to React Pizza Admin</h3>
                <p className="text-gray-600">
                  Chào mừng bạn đến với hệ thống quản lý. Chọn menu bên trái để bắt đầu quản lý sản phẩm, danh mục, đơn hàng...
                </p>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
