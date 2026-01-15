import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './reduxs/store';
import Routers from './routers/Routers';
import Dashboard from './pages/auth/Dashboard';
import Home from './pages/users/Home';
import LoginAdmin from './pages/auth/LoginAdmin';
import ProductsDetails from './pages/users/products/[slug]/[id]/ProductsDetails';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/users/products/:slug/:id" element={<Routers Component={ProductsDetails} />} />
          <Route path="/auth/loginAdmin" element={<Routers Component={LoginAdmin} />} />
          <Route path="/Dashboard" element={<Routers Component={Dashboard} />} />
          <Route path="/" element={<Routers Component={Home} />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
