$(window).ready(function () {
	$('.finish').on('click', function () {
		var loginname = $('.loginname').val();
		var password  = $('.password').val();
		var email = $('.email').val();
		if (checkChar(loginname) !== 1) {
			return hint('user name can not have special character !');
		}
		if (!loginname || !password || !email) {
			return hint('need fill all!');
		}
		if (loginname.length < 2 || loginname.length > 12) {
			hint('username too short or too long!');
			return;
		}
		if (password.length < 6) {
			hint('password length need over 6');
			return;
		}
		if (password.length > 16) {
			hint('password leagth too long?');
			return;
		}
		if (!/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(email)) {
			hint('email error!');
			return;
		}
		var $This = $(this);
		$This.html('<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');
		var data = 'loginname=' + loginname + '&password=' + md5(password) + '&email=' + email;
		$.ajax({
			type: 'POST',
			url: '/api/user/new',
			data: data,
			success: function (msg) {
				if (msg.states < 1) {
					hint(msg.hint);
					$This.html('register');
					return;
				}
				window.location.href = '/';
			}
		})
	});
});