$(window).ready(function () {
	$('.finish').on('click', function () {
		var $this = $(this);
		var description = $('.description').val();
		var qq = $('.qq').val();
		var wb = $('.wb').val();

		if (description.length > 150) {
			hint('the description is too long ,it should be within 150 words');
			return;
		}
		if (qq.length > 100 || wb.length > 100) {
			hint('the link is too long');
			return;
		}
		var data = 'description=' + description + '&qq=' + qq + '&wb=' + wb;
		$this.html('<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');
		$.ajax({
			type: 'post',
			url : '/api/user/edit',
			data: data,
			success: function (msg) {
				hint(msg.hint);
				$this.html('update');
			}
		})
	});


	uploadAvatar($('#avatar'), $('.avatar-img'));
});
