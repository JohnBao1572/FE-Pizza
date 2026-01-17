import { useState } from 'react';
import { Form, Input, Button, Spin, message } from 'antd';
import { GoogleOutlined, FacebookOutlined, GithubOutlined, LinkedinOutlined } from '@ant-design/icons';

import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import handleAPI from '../../../apis/handleAPI';
import type { LoginResponse } from '../../../models/UserModel';
import { localDataNames } from '../../../constants/appInfos';
import { addAuth } from '../../../reduxs/reducers/authReducer';
import axiosClient from '../../../apis/axiosClient';
const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (values: { email: string; password: string }) => {
        setIsLoading(true);
        setErrorMsg('');

        try {
            const res = await handleAPI({
                url: '/user/login',
                data: values,
                method: 'post'
            }) as unknown as LoginResponse;

            localStorage.setItem(localDataNames.authData, JSON.stringify(res));
            dispatch(addAuth(res));
            axiosClient.defaults.headers.common['Authorization'] = `Bearer ${res.accessToken}`;

            navigate('/', { replace: true });
        } catch (error) {
            message.error("Login failed, please try again");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginGoogle = () => {
        const width = 500;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const popup = window.open(
            'http://localhost:3000/api/v1/user/google', // 🔥 URL BE GOOGLE LOGIN
            'Google Login',
            `width=${width},height=${height},left=${left},top=${top}`
        );

        if (!popup) {
            message.error('Popup blocked');
            return;
        }

        // Lắng nghe message từ popup
        const listener = (event: MessageEvent) => {
            if (event.origin !== 'http://localhost:3000') return;

            const { accessToken, user } = event.data;

            if (!accessToken) return;

            const authData = {
                accessToken,
                user,
            };

            localStorage.setItem(localDataNames.authData, JSON.stringify(authData));
            dispatch(addAuth(authData));
            axiosClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

            window.removeEventListener('message', listener);
            popup.close();

            navigate('/', { replace: true });
        };

        window.addEventListener('message', listener);
    };


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
            {/* MAIN CARD */}
            <div className="w-[900px] h-[520px] bg-white rounded-2xl shadow-2xl flex overflow-hidden">

                {/* LEFT - FORM (CENTERED) */}
                <div className="w-1/2 flex items-center justify-center">
                    <div className="w-[80%]">
                        <h2 className="text-3xl font-bold text-center mb-3">Sign In</h2>

                        {/* Social */}
                        <div className="flex justify-center gap-3 mb-4">
                            <div
                                className="w-10 h-10 border rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100"
                                onClick={handleLoginGoogle}
                            >
                                <GoogleOutlined />
                            </div>
                            <div className="w-10 h-10 border rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100">
                                <FacebookOutlined />
                            </div>
                            <div className="w-10 h-10 border rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100">
                                <GithubOutlined />
                            </div>
                            <div className="w-10 h-10 border rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100">
                                <LinkedinOutlined />
                            </div>
                        </div>

                        <p className="text-center text-gray-400 text-sm mb-4">
                            Sign in with Email & Password
                        </p>

                        {errorMsg && (
                            <div className="mb-3 text-center text-red-500 font-medium">
                                {errorMsg}
                            </div>
                        )}

                        <Form layout="vertical" onFinish={handleLogin}>
                            <Form.Item
                                name="email"
                                rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                            >
                                <Input size="large" placeholder="Enter E-mail" />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                            >
                                <Input.Password size="large" placeholder="Enter Password" />
                            </Form.Item>

                            <div className="text-right text-sm text-gray-400 cursor-pointer hover:underline mb-4">
                                Forget Password?
                            </div>

                            <Button
                                htmlType="submit"
                                type="primary"
                                danger
                                block
                                size="large"
                                className="rounded-full"
                                disabled={isLoading}
                            >
                                {isLoading ? <Spin /> : 'SIGN IN'}
                            </Button>
                        </Form>
                    </div>
                </div>

                {/* RIGHT - RED PANEL */}
                <div className="w-1/2 bg-red-500 text-white flex flex-col items-center justify-center px-10">
                    <h2 className="text-4xl font-bold mb-4">Hello World</h2>
                    <p className="text-center mb-6">
                        Sign up now and enjoy our site
                    </p>
                    <Link to="/SignUp">
                        <Button
                            ghost
                            size="large"
                            className="rounded-full px-10 border-white text-white hover:!text-red-500 hover:!bg-white"
                        >
                            SIGN UP
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
