import React, { useState } from 'react';
import handleAPI from '../../apis/handleAPI';
import { localDataNames } from '../../constants/appInfos';
import axiosClient from '../../apis/axiosClient';
import type { LoginResponse } from '../../models/UserModel';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addAuth } from '../../reduxs/reducers/authReducer';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        try {
            const res = await handleAPI({
                url: '/user/login',
                data: {
                    email,
                    password
                },
                method: 'post'
            }) as unknown as LoginResponse;

            // ================== FIX: Lưu token + sync redux ==================
            localStorage.setItem(localDataNames.authData, JSON.stringify(res));
            dispatch(addAuth(res));

            // Đặt header mặc định cho axios để các request kế tiếp dùng token mới
            axiosClient.defaults.headers.common['Authorization'] = `Bearer ${res.accessToken}`;
            // ================================================================
            alert('Đăng nhập thành công!');
            navigate('/', { replace: true });
        } catch (error: any) {
            console.error(error);
            setErrorMsg(error.message || 'Đăng nhập thất bại, vui lòng kiểm tra lại!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
            <div style={{ padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Đăng Nhập</h2>

                {errorMsg && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{errorMsg}</div>}

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                            placeholder="Nhập email..."
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Mật khẩu:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                            placeholder="Nhập mật khẩu..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{ width: '100%', padding: '0.75rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: isLoading ? 'not-allowed' : 'pointer' }}
                    >
                        {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
