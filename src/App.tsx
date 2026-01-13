import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './reduxs/store';
import Routers from './routers/Routers';
import Login from './pages/auth/Login';
import Home from './pages/auth/Home';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/auth/login" element={<Routers Component={Login} />} />
          <Route path="/" element={<Routers Component={Home} />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
