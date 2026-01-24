import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './reduxs/store';
import Routers from './routers/Routers';
import Dashboard from './pages/auth/Dashboard';
import Home from './pages/users/Home';
import LoginAdmin from './pages/auth/LoginAdmin';
import ProductsDetails from './pages/users/products/[slug]/[id]/ProductsDetails';
import Login from './pages/users/login/Login';
import Register from './pages/users/login/SignUp';
import SignUp from './pages/users/login/SignUp';
import ProfilePage from './pages/users/profile/Profile';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/users/products/:slug/:id" element={<Routers Component={ProductsDetails} />} />
          <Route path="/login" element={<Routers Component={Login} />} />
          <Route path="/SignUp" element={<Routers Component={SignUp} />} />
          <Route path="/register" element={<Routers Component={Register} />} />
          <Route path="/auth/loginAdmin" element={<Routers Component={LoginAdmin} />} />
          <Route path="/Dashboard" element={<Routers Component={Dashboard} />} />
          <Route path="/profile" element={<Routers Component={ProfilePage} />} />
          <Route path="/" element={<Routers Component={Home} />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
