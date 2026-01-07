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

	useEffect(() => {
		getData();
	}, []);

	useEffect(() => {
		const res = localStorage.getItem(localDataNames.authData);
		const localToken = res ? JSON.parse(res).accessToken : '';
		const token = auth.accessToken || localToken;

		if (token && path.includes('/auth')) {
			navigate('/');
		} else if (!token && !path.includes('/auth')) {
			navigate('/auth/login');
		}
	}, [auth, path, navigate]);

	const getData = async () => {
		const res = localStorage.getItem(localDataNames.authData);
		res && dispatch(addAuth(JSON.parse(res)));
	};

	return path.includes('/auth') ? (
		<div className='bg-white min-h-screen'>
			<Component pageProps={pageProps} />
		</div>
	) : (
		<div className='bg-white min-h-screen'>
			{/* <HeaderComponent /> */}
			<Component pageProps={pageProps} />
		</div>
	);
};

export default Routers;
