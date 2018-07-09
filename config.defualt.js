
var config = {
	domain: '',

    title: 'food sharing',

    description: 'food sharing place',

    keywords: 'food;share',

	mini_assets: false,  // compress static resources

	static_host: '',    //cdn static file storage host domain

	// http://open.weibo.com/
	wb: {
		ID: '',
		SECRET: '',
		CALLBACK_URI: ''
	},

	//https://connect.qq.com/
	qq: {
		ID: '',
		SECRET: '',
		CALLBACK_URI: ''
	},

	
	qiniu: {
		ACCESS_KEY: '',
		SECRET_KEY: '',
		BUCKET: '', // the name of the picture bucket
		watermark: '', // ormat for watermark
		shrink: '',  // shrinking format
		URL: '' 
	},

	// Database configuration
	db: 'mongodb://127.0.0.1/funny_conmunity',

	// session 
	session_secret: 'please input',

	// token 
	token_secret: 'please input',

	
	password_secret: 'please input',

	//  the food posting could be displayed after xx users’ authorization.
	//  the food posting should be closed after xx users’ non-authorization.
	pass_count: 3,

	// How many likes could be received when the posting is published
	start_like: 10,

	// How many likes could be received when users vote a like on the posting.
	like: 10,

	// how many postings are displayed in one page
	topic_limit: 20,

	// how many comments are displayed in one page
	reply_limit: 20,

	// how many default avatars
	avatar_default_count: 80,

	// maximum number of food postings
	max_topic_img: 3
};
module.exports = config;