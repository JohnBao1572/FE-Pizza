import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { localDataNames } from '../constants/appInfos';
import { addAuth, authSelector } from '../reduxs/reducers/authReducer';

const Routers = ({ Component, pageProps }: any) => {
	const location = useLocation();
	const path = location.pathname;
	const dispatch = useDispatch();
	const auth = useSelector(authSelector);
	const navigate = useNavigate();

	// ================== FIX 1: Load auth từ localStorage vào redux đúng cách ==================
	useEffect(() => {
		const res = localStorage.getItem(localDataNames.authData);
		if (res) {
			const parsed = JSON.parse(res);
			if (parsed?.accessToken) {
				dispatch(addAuth(parsed));
			}
		}
	}, [dispatch]);

	useEffect(() => {
		const token = auth?.accessToken;

		if (!token && !path.includes('/auth') && path !== '/') {
			navigate('/auth/loginAdmin', { replace: true });
		}

		if (token && path.includes('/auth')) {
			navigate('/Dashboard', { replace: true });
		}
	}, [auth, path, navigate]);

	return path.includes('/auth') ? (
		<div className='bg-white min-h-screen'>
			<Component pageProps={pageProps} />
		</div>
	) : (
		<div className='bg-white min-h-screen'>
			<Component pageProps={pageProps} />
		</div>
	);
};

export default Routers;
