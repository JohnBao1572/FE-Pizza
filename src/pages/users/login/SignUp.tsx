/** @format */

import {
    Button,
    Checkbox,
    Divider,
    Form,
    Input,
    message,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import { BsArrowLeft } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import handleAPI from '../../../apis/handleAPI';
import { addAuth } from '../../../reduxs/reducers/authReducer';
import { Link, useNavigate } from 'react-router-dom';

interface SignUp {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

const SignUp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isAgree, setIsAgree] = useState(true);

    // ✅ CHANGED: signValues dùng để quyết định hiển thị OTP hay Form
    const [signValues, setSignValues] = useState<any>(null);

    const [numsOfCode, setNumsOfCode] = useState<string[]>([]);
    const [times, setTimes] = useState(60);

    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const inpRef1 = useRef<any>(null);
    const inpRef2 = useRef<any>(null);
    const inpRef3 = useRef<any>(null);
    const inpRef4 = useRef<any>(null);
    const inpRef5 = useRef<any>(null);
    const inpRef6 = useRef<any>(null);

    /* ================= OTP TIMER ================= */
    useEffect(() => {
        // ✅ IMPORTANT: chỉ chạy timer khi đã signup xong (có signValues)
        if (!signValues) return;

        const timer = setInterval(() => {
            setTimes((t) => t - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [signValues]);

    /* ================= SIGN UP ================= */
    const handleSignUp = async (values: SignUp) => {
        setIsLoading(true);
        try {
            const res = await handleAPI({
                url: `/user/signup`,
                method: 'post',
                data: values,
            });

            // ✅ CHANGED: lưu user vừa đăng ký → chuyển sang màn OTP
            setSignValues(res.data);

            // ✅ RESET OTP STATE
            setNumsOfCode([]);
            setTimes(60);
        } catch (error) {
            message.error('User is existing');
        } finally {
            setIsLoading(false);
        }
    };

    /* ================= OTP ================= */
    const handleChangeNumsCode = (val: string, index: number) => {
        const items = [...numsOfCode];
        items[index] = val;
        setNumsOfCode(items);
    };

    const handleVerify = async () => {
        // ✅ IMPORTANT: check đủ 6 ký tự
        if (numsOfCode.filter(Boolean).length < 6) {
            message.error('Invalid code');
            return;
        }

        try {
            const code = numsOfCode.join('').toUpperCase();

            const res = await handleAPI({
                url: `/user/verify/${signValues._id}`, // ✅ dùng id user vừa signup
                method: 'put',
                data: { code },
            });

            // ✅ AUTO LOGIN
            dispatch(addAuth(res.data));
            localStorage.setItem('authData', JSON.stringify(res.data));

            // ✅ NAVIGATE HOME
            navigate('/');
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Verification failed');
        }
    };

    const handleResendCode = async () => {
        try {
            await handleAPI({
                url: `/user/resend/${signValues._id}`,
            });

            // ✅ RESET OTP + TIMER
            setNumsOfCode([]);
            setTimes(60);
        } catch (error) {
            message.error('Cannot resend code');
        }
    };

    /* ================= UI ================= */
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
            <div className="w-[900px] h-[520px] bg-white rounded-2xl shadow-2xl flex overflow-hidden">

                {/* LEFT */}
                <div className="w-1/2 bg-red-500 text-white flex flex-col items-center justify-center px-10">
                    <h2 className="text-4xl font-bold mb-4">Hello Friend!</h2>
                    <p className="text-center mb-6">
                        Already have an account?
                    </p>
                    <Link to="/login">
                        <Button ghost size="large">
                            SIGN IN
                        </Button>
                    </Link>
                </div>

                {/* RIGHT */}
                <div className="w-1/2 flex items-center justify-center">
                    <div className="w-[80%]">

                        {signValues ? (
                            <>
                                {/* ================= OTP UI ================= */}
                                <Button
                                    type="text"
                                    icon={<BsArrowLeft size={20} />}
                                    onClick={() => setSignValues(null)} // ✅ quay lại signup
                                >
                                    Back
                                </Button>

                                <h2 className="text-2xl font-bold mt-4">Enter OTP</h2>
                                <p className="text-gray-400 mb-6">
                                    We sent a code to {signValues.email}
                                </p>

                                <div className="flex justify-between mb-6">
                                    {[0, 1, 2, 3, 4, 5].map((i) => (
                                        <Input
                                            key={i}
                                            ref={[
                                                inpRef1,
                                                inpRef2,
                                                inpRef3,
                                                inpRef4,
                                                inpRef5,
                                                inpRef6,
                                            ][i]}
                                            value={numsOfCode[i]}
                                            maxLength={1}
                                            size="large"
                                            className="text-center text-xl font-bold"
                                            style={{ width: 48 }}
                                            onChange={(e) => {
                                                handleChangeNumsCode(e.target.value, i);
                                                if (e.target.value && i < 5) {
                                                    [
                                                        inpRef2,
                                                        inpRef3,
                                                        inpRef4,
                                                        inpRef5,
                                                        inpRef6,
                                                    ][i]?.current?.focus();
                                                }
                                            }}
                                        />
                                    ))}
                                </div>

                                <Button
                                    type="primary"
                                    danger
                                    block
                                    size="large"
                                    loading={isLoading}
                                    onClick={handleVerify}
                                >
                                    Verify
                                </Button>

                                <div className="text-center mt-3">
                                    {times <= 0 ? (
                                        <Button type="link" onClick={handleResendCode}>
                                            Resend Code
                                        </Button>
                                    ) : (
                                        <span className="text-gray-400">
                                            Resend in {times}s
                                        </span>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                {/* ================= SIGN UP UI ================= */}
                                <h2 className="text-3xl font-bold text-center mb-3">
                                    Create Account
                                </h2>

                                <Form
                                    layout="vertical"
                                    form={form}
                                    onFinish={handleSignUp}
                                    disabled={isLoading}
                                >
                                    <Form.Item name="firstName" rules={[{ required: true }]}>
                                        <Input size="large" placeholder="First Name" />
                                    </Form.Item>

                                    <Form.Item name="lastName" rules={[{ required: true }]}>
                                        <Input size="large" placeholder="Last Name" />
                                    </Form.Item>

                                    <Form.Item
                                        name="email"
                                        rules={[{ required: true, message: 'Please enter email!' }]}
                                    >
                                        <Input size="large" placeholder="Email" />
                                    </Form.Item>

                                    <Form.Item
                                        name="password"
                                        rules={[{ required: true, message: 'Please enter password!' }]}
                                    >
                                        <Input.Password size="large" placeholder="Password" />
                                    </Form.Item>

                                    <Checkbox
                                        checked={isAgree}
                                        onChange={(e) => setIsAgree(e.target.checked)}
                                        className="mb-4"
                                    >
                                        I agree to Terms & Conditions
                                    </Checkbox>

                                    <Button
                                        htmlType="submit"
                                        type="primary"
                                        danger
                                        block
                                        size="large"
                                        loading={isLoading}
                                        disabled={!isAgree}
                                    >
                                        SIGN UP
                                    </Button>
                                </Form>

                                <Divider />

                                <div className="text-center">
                                    <Link to="/login">Already have an account?</Link>
                                </div>
                            </>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
