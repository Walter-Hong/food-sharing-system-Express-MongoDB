


$(window).ready(function () {


// display and close the comment
    var $reply = $('.reply');                // reply comment page
    var $replyDefault = $('.default');              // loading comment animation
    var $replyButton = $('.reply-button');         // reply button
    var $replyWrap = $('.reply-wrap');           // replay warp
    var replyModel = $('#replyTemplate').html(); // reply module

//button of like on comment
    var $replyLikeBnt = $('.reply-like-btn');

    $replyButton.on('click', function () {
        this.off = !this.off;  // checking whether it is displayed or closed

        var $This = $(this);
        var height = $This.offset().top - 130;

        // $('html,body').animate({scrollTop: height}, 300);

        var index = $replyButton.index($This);
        if (this.off) {
            $reply.eq(index).css('display', 'block');
        } else {
            $reply.eq(index).css('display', 'none');
        }
        if (!this.one) {
            this.one = true;       //  check whether it is clicked for the first time and record it.
            var topicId = $This.attr('data-topic-id');
            getReply(topicId, function (err, msg) {
                if (err || msg.states < 1) {
                    return hint('server error!');
                }
                if (msg.states === 1) {
                    var data = msg.data;
                    var temp = '';
                    for (var i = 0; i < data.length; i++) {
                        var liked = '';
                        if (data[i].liked === 1) {
                            liked = ' on';
                        }
                        temp +=
                            replyModel.replace(/\[name\]/gi, data[i].name).replace('[avatar]', data[i].avatar).replace('[text]', data[i].content).replace('[like]', data[i].like_count).replace('[floor]', data[i].floor).replace('[_id]', data[i]._id).replace('[liked]', liked).replace('[is-liked]', data[i].liked);

                    }
                }

                $replyDefault.eq(index).css('display', 'none');
                $replyWrap.eq(index).append(temp);
                // connect event with every buttons
                likeReplyBind();
            });
        }

    });


// like
    var $likeButton = $('.like');
    var $buyButton = $('.buy');
    var $likeIcon = $('.like i');
    var $likeCount = $('.like em');
    $buyButton.on('click', function () {
        if (!window.login_state) {
            window.location.href = '/user/login';
            return hint('need login first!');
        }
        var $This = $(this);
        if (parseInt($This.attr('liked')) === 1) {
            return;
        }

        var index = $likeButton.index($This);
        $This.css({'backgroundColor': '#eff3f5', 'color': '#3498DB'});
        $This.attr('liked', '1');
        like($This.attr('data-topic-id'), function (err, msg) {
            if (err || msg.states < 1) {
                hint(msg.hint);
            }
        });
        hint("buy success")
        $('.post-id-' + $This.attr('data-topic-id')).hide()
        $likeCount.eq(index).css('color', '#3498DB');
        $likeCount.eq(index).html(parseInt($likeCount.eq(index).html()) + 1);
        $likeIcon.eq(index).html('&#xe60a;');
        $likeIcon.eq(index).css({
            'color': '#FF6161',
            'animation': 'like .6s ease',
            '-webkit-animation': 'like .6s ease',
            'textShadow': '0 0 5px #ff7ebc'
        })
    });
    $likeButton.on('click', function () {
        if (!window.login_state) {
            window.location.href = '/user/login';
            return hint('need login first!');
        }
        var $This = $(this);
        if (parseInt($This.attr('liked')) === 1) {
            return;
        }

        var index = $likeButton.index($This);
        $This.css({'backgroundColor': '#eff3f5', 'color': '#3498DB'});
        $This.attr('liked', '1');
        like($This.attr('data-topic-id'), function (err, msg) {
            if (err || msg.states < 1) {
                hint(msg.hint);
            }
        });

        $likeCount.eq(index).css('color', '#3498DB');
        $likeCount.eq(index).html(parseInt($likeCount.eq(index).html()) + 1);
        $likeIcon.eq(index).html('&#xe60a;');
        $likeIcon.eq(index).css({
            'color': '#FF6161',
            'animation': 'like .6s ease',
            '-webkit-animation': 'like .6s ease',
            'textShadow': '0 0 5px #ff7ebc'
        })
    });
// comment and reply

    var $replyBnt = $('.comment-bnt');

    $replyBnt.on('click', function () {
        if (!window.login_state) {
            window.location.href = '/user/login';
            return hint('need login first!');
        }
        var index = $replyBnt.index(this);
        var $replyContent = $('.comment-content').eq(index);
        if ($replyContent.val().length < 1 || $replyContent.val().length > 150) {
            return hint('the comment could not be empty or over 150 words!');
        }
        addReply($replyContent.attr('data-topic-id'), $replyContent.val(), function (err, msg) {
            if (err) return hint('server error!');
            hint(msg.hint);
            var temp =
                replyModel.replace(/\[name\]/gi, window.user_info.loginname).replace('[avatar]', window.user_info.avatar).replace('[text]', filterTag($replyContent.val())).replace('[like]', 0).replace('[floor]', 'n').replace('[_id]', msg._id).replace('[liked]', '');
            $replyWrap.eq(index).append(temp.toString());
            $replyContent.val('');
            likeReplyBind();
        });
    });

// add a like for a comment
    function likeReplyBind() {
        $replyLikeBnt = $('.reply-like-btn');
        $replyLikeBnt.off('click').on('click', function () {
            if (!window.login_state) {
                window.location.href = '/user/login';
                return hint('need login first!');
            }
            var $This = $(this);
            if (parseInt($This.attr('liked')) === 1) {
                return;
            }
            $This.addClass('on');
            likeReply($This.attr('data-reply-id'), function (err, msg) {
                if (err) {
                    return hint('server error!')
                }
                $This.find('span').html(parseInt($This.find('span').html()) + 1);
            });
            $This.attr('liked', 1);
        });
    }


    window.$shareTitle = $('.content-title');
    window.$shareImg = $('.content-picture');


});

//  food-sharing posting
function shareTo(id, type, postId) {
    var title = $shareTitle[id].innerText;
    var img = $shareImg[id].src;
    var url = window.location.origin + postId;
    var href = '';
    if (type === 'qq') {
        href = "https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=" + url + "&showcount=1&desc=&summary=来自一个正经的网站&title=" + title + "&site=逗你的 一个正经网站&pics=" + img
    }
    if (type === 'wb') {
        href = "http://service.weibo.com/share/share.php?title=" + title + "&pic=" + img + "&url=" + url
    }
    window.open(href, "_blank", 'width=630,height=630,toolbar=no, menubar=no, scrollbars=no, location=no,status=no');
}