class Menu {
    constructor({box, obj, fncb, Bok = true}) {
        this.menu_box = $(box);
        this.fncb = fncb;
        this.timer = null;
        this.Bok = Bok;
        this.obj = obj;
        this.init();
    }

    init() {
        let _this = this;

        //判断是否有滚动条
        if (this.menu_box.find('ul').children().length >= 12) {
            this.menu_box
                .find('.forum_menu_list').css({
                    height: '300px',
                    overflow: 'hidden'
                })
                .find('ul').css({
                    position: "absolute",
                    left: 0,
                    top: 0
                })
                .find('li').css('paddingRight', '10px');

            //拖动滚动条
            this.menu_box.find('.forum_menu_scroll div').on('mousedown.forum_menu', function (ev) {

                let that = this,
                    disY = ev.clientY - $(this).position().top;

                $(document).on('mousemove.forum_menu', function (ev) {
                    let t = ev.clientY - disY;

                    _this.scrollFn(t);
                });

                $(document).on('mouseup.forum_menu', function () {
                    $(document).off('mouseup.forum_menu');
                    $(document).off('mousemove.forum_menu');

                    that.releaseCapture && that.releaseCapture();
                });

                this.setCapture && this.setCapture();
                return false;
            });

            //滚轮
            this.bindScrollEvent();
        }

        this.menu_box.find('input').click(function () {
            clearTimeout(_this.timer);

            _this.showHideFn();
        });

        this.menu_box.find('li').on('mousedown', function () {
            clearTimeout(_this.timer);

            if (_this.Bok) {
                $(_this.obj).val($.trim($(this).html())).attr('data-value', $(this).attr('data-value'));
            }

            _this.fncb && _this.fncb(this);

            $(this).closest('.forum_menu_list').hide();
        });

        this.menu_box.find('input').on('blur', function () {
            let that = $(this);

            _this.timer = setTimeout(function () {
                that.parent().find('.forum_menu_list').hide();
            }, 200);
        });

        this.menu_box.find('span').on('click', function () {
            clearTimeout(_this.timer);
            _this.menu_box.find('input').trigger('click');
        });

        this.menu_box.find('span').on('blur', function () {
            _this.menu_box.find('input').trigger('blur');
        });

        //添加焦点
        this.menu_box.find('span').attr('tabindex', 0);

        //解决mac机firefox下的button没有焦点的问题
        this.menu_box.attr('tabindex', 0);

        this.menu_box.on('blur', function () {
            _this.menu_box.find('input').trigger('blur');
        });

    }

    showHideFn() {
        if (this.menu_box.find('ul').children().length != 0) {
            let oShowHide = this.menu_box.find('.forum_menu_list').css('display');

            if (oShowHide == 'none') {
                this.menu_box.find('.forum_menu_list').show();
            } else {
                this.menu_box.find('.forum_menu_list').hide();
            }
        }
    }

    scrollFn(t) {
        let scrollBar = this.menu_box.find('.forum_menu_scroll div'),
            scrollBox = this.menu_box.find('.forum_menu_scroll'),
            oDiv = this.menu_box.find('.forum_menu_list'),
            oUl = this.menu_box.find('ul');

        if (t < 0) {
            t = 0;
        } else if (t > scrollBox.outerHeight() - scrollBar.outerHeight()) {
            t = scrollBox.outerHeight() - scrollBar.outerHeight();
        }

        scrollBar.css('top', t + 'px');

        let scale = t / (scrollBox.outerHeight() - scrollBar.outerHeight());
        oUl.css('top', -(oUl.outerHeight() - oDiv.outerHeight()) * scale + 'px');
    }

    wheelFn({oEv, cbFn}) {
        let b = true;

        if (oEv.wheelDelta) {
            b = oEv.wheelDelta > 0 ? true : false;
        } else {
            b = oEv.detail < 0 ? true : false;
        }

        cbFn(b);         //回调函数

    }

    bindScrollEvent() {
        let scrollBox = this.menu_box.find('.forum_menu_list').get(0),
            _this = this;

        if (window.navigator.userAgent.indexOf('Firefox') != -1) {
            scrollBox.addEventListener('DOMMouseScroll', function (ev) {
                let oEv = ev || event;
                _this.wheelInitFn(oEv);

                oEv.preventDefault && oEv.preventDefault();
                return false;

            }, false);
        } else {
            scrollBox.onmousewheel = function (ev) {
                let oEv = ev || event;
                _this.wheelInitFn(oEv);

                oEv.preventDefault && oEv.preventDefault();
                return false;
            };
        }
    }

    wheelInitFn(ev) {
        let scrollBar = this.menu_box.find('.forum_menu_scroll div'),
            _this = this;

        this.wheelFn({
            oEv: ev,
            cbFn: (b)=> {
                let t = scrollBar.position().top;

                if (b) {
                    t -= 50;
                } else {
                    t += 50;
                }

                _this.scrollFn(t);
            }
        });
    }

}


let menu = (options)=> {
    new Menu(options)
};

export {menu};
