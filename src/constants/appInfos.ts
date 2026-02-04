// Nơi lưu trữ local_Storage

export const localDataNames = {
	authData: 'authData',
};

export const appInfo = {
	logo: 'https://scontent.fhan3-2.fna.fbcdn.net/v/t39.30808-6/325906376_2074777692727406_1745368239073569186_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=ispnTI4qAk4Q7kNvgGVNU4t&_nc_oc=AdkU-HjUPY5P7rOIqGHRGvkr8AbKCU6X0sWNGv0Mu3TDIp98bPhV-kbHY37FoZJNxW4&_nc_zt=23&_nc_ht=scontent.fhan3-2.fna&_nc_gid=OLVVh_mKUueVg2OBb73nwg&oh=00_AYHYU50QMhZi1Trdy3LKyepL7KHMzs517Nn8mtbtlLzkEQ&oe=67E15DCD',

	title: 'Thiên Bảo',
	description: '',
	baseUrl: import.meta.env.MODE === 'development' 
	? 'http://localhost:3000/api/v1' 
	: 'https://be-pizzashop.onrender.com/api/v1',
	monthShortNames: [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sept',
		'Oct',
		'Nov',
		'Dec',
	],
}