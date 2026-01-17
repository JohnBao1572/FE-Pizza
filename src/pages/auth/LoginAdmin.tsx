import { useState } from 'react';
import { Form, Input, Button, Spin } from 'antd';
import { GoogleOutlined, FacebookOutlined, GithubOutlined, LinkedinOutlined } from '@ant-design/icons';
import handleAPI from '../../apis/handleAPI';
import { localDataNames } from '../../constants/appInfos';
import axiosClient from '../../apis/axiosClient';
import type { LoginResponse } from '../../models/UserModel';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addAuth } from '../../reduxs/reducers/authReducer';

const LoginAdmin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (values: { email: string; password: string }) => {
        setIsLoading(true);
        setErrorMsg('');

        try {
            const res = await handleAPI({
                url: '/auths/login-admin',
                data: values,
                method: 'post'
            }) as unknown as LoginResponse;

            if (res.user.role !== 'admin') {
                setErrorMsg('Bạn không có quyền truy cập trang quản trị!');
                setIsLoading(false);
                return;
            }

            localStorage.setItem(localDataNames.authData, JSON.stringify(res));
            dispatch(addAuth(res));
            axiosClient.defaults.headers.common['Authorization'] = `Bearer ${res.accessToken}`;

            navigate('/Dashboard', { replace: true });
        } catch (error: any) {
            const backendMsg = error?.response?.data?.message;

            switch (backendMsg) {
                case 'not-found-account-admin':
                    setErrorMsg('Tài khoản admin không tồn tại!');
                    break;
                case 'password-is-incorrect':
                    setErrorMsg('Mật khẩu không chính xác!');
                    break;
                case 'You-are-not-allow-to-login-this-resource':
                    setErrorMsg('Bạn không có quyền truy cập trang quản trị!');
                    break;
                default:
                    setErrorMsg('Đăng nhập thất bại, vui lòng thử lại!');
                    break;
            }
        } finally {
            setIsLoading(false);
        }
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
                            <div className="w-10 h-10 border rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100">
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
                    <Button
                        ghost
                        size="large"
                        className="rounded-full px-10 border-white text-white hover:!text-red-500 hover:!bg-white"
                    >
                        SIGN UP
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default LoginAdmin;
