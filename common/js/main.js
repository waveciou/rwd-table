$(function () {

    const $window = $(window);
    let screenWidth = $window.outerWidth();

    // * ==========================================================================
    // * Footable 的設定
    // * ==========================================================================

    function setFootable() {
        let $footable = $('.footable');
        if ($footable.length) {
            $footable.footable({
                calculateWidthOverride: function calculateWidthOverride() {
                    return {
                        width: $window.width()
                    };
                }
            });
        }
    }

    setFootable()

    // * ==========================================================================
    // * PocketTable 的設定
    // * ==========================================================================

    const pocketTable = {
        desktop: 4,
        mobile: 2,
        breakpoint: 768
    }

    function setPocketTable() {
        if (pocketTable.desktop < 1 || pocketTable.mobile < 1) {
            console.error('Pocket Table 的 desktop & mobile 最少要設定1欄。');
            return false
        }

        $('.pocketTable').each(function () {
            const $table = $(this);
            let titleList = [];

            $table.find('thead th').each(function () {
                titleList.push($(this).text());
            });

            $table.find('thead > tr').append('<th class="pocketTable__trigger-column"></th>');

            $table.find('tbody > tr').each(function () {
                let $this = $(this);
                let textList = [];
                let textStr = '';

                $this.find('td').each(function () {
                    textList.push($(this).text());
                });

                for (let i = 0; i < textList.length; i++) {
                    textStr = `${textStr}
                    <div class="pocketTable__detail-row">
                        <div class="pocketTable__detail-name">${titleList[i]}</div>
                        <div class="pocketTable__detail-value">${textList[i]}</div>
                    </div>`;
                }

                $this.after('<tr class="pocketTable__detail"></tr>');

                $this.next('.pocketTable__detail').append(`
                <td class="pocketTable__detail-cell" colspan="${textList.length + 1}">
                    <div class="pocketTable__detail-inner">${textStr}</div>
                </td>`);

                $this.append(`
                <td class="pocketTable__trigger-column">
                    <a href="javascript:;" class="pocketTable__switch-btn"></a>
                </td>`);
            });

            $table.find('.pocketTable__switch-btn').on('click', function (e) {
                e.stopImmediatePropagation();
                let $btn = $(this);
                let $detail = $btn.parents('tr').next('.pocketTable__detail');

                $btn.toggleClass('is-open');

                if ($btn.hasClass('is-open') === true) {
                    $detail.stop(true, true).slideDown(0);
                } else {
                    $detail.stop(true, true).slideUp(0);
                }
            });

            $table.find('tbody > tr').not('.pocketTable__detail').on('click', function () {
                $(this).find('.pocketTable__switch-btn').trigger('click');
            });
        });
    }

    function ctrlPocketTableColumn(width, breakpoint) {
        if (pocketTable.desktop < 1 || pocketTable.mobile < 1) {
            return false
        }

        $('.pocketTable th, .pocketTable td').not('.pocketTable .pocketTable__detail-cell').each(function () {
            let $this = $(this);
            let index = $this.index();
            $this.removeClass('pocketTable__hide');
            if (width > breakpoint) {
                $this.css('width', `${100 / pocketTable.desktop}%`);
                if (index > pocketTable.desktop - 1) {
                    $this.addClass('pocketTable__hide');
                }
            } else {
                $this.css('width', `${100 / pocketTable.mobile}%`);
                if (index > pocketTable.mobile - 1) {
                    $this.addClass('pocketTable__hide');
                }
            }
        });

        $('.pocketTable__detail-row').each(function () {
            let $this = $(this);
            let index = $this.index();
            $this.removeClass('pocketTable__hide');
            if (width > breakpoint) {
                if (index < pocketTable.desktop) {
                    $this.addClass('pocketTable__hide');
                }
            } else {
                if (index < pocketTable.mobile) {
                    $this.addClass('pocketTable__hide');
                }
            }
        });
    }

    setPocketTable();

    // * ==========================================================================
    // * ListTable 的設定
    // * ==========================================================================

    function setListTable() {
        $('.listTable').each(function () {
            let $table = $(this);
            let headlineList = [];

            $table.find('thead th').each(function () {
                headlineList.push($(this).text());
            });

            $table.find('tbody td').each(function (index) {
                let i = index % headlineList.length;
                $(this).attr('data-headline', headlineList[i]);
            });
        });
    }

    setListTable();

    // * ==========================================================================
    // * SwipeTable 的設定
    // * ==========================================================================

    const $swipeTable = $('.swipeTable');

    function ctrlSwipeTableNotice(width) {
        if ($swipeTable && width <= 1024) {
            $swipeTable.each(function() {
                let $table = $(this);
                let $innerWrap = $table.parent('.swipeTable__innerwrap');
                let $notice = $innerWrap.siblings('.swipeTable__notice');

                if ($table.width() > $innerWrap.width()) {
                    $notice.addClass('is-open');
                } else {
                    $notice.removeClass('is-open');
                }
            });
        }
    }

    function setSwipeTable() {
        $swipeTable.each(function() {
            let $table = $(this);
            let notice = $table.data('notice');
            $table.wrap(`<div class="swipeTable__outerwrap"><div class="swipeTable__innerwrap"></div></div>`);
            $table.parent('.swipeTable__innerwrap').before(`<p class="swipeTable__notice">${notice}</p>`);
        });
    }

    setSwipeTable();

    // * ==========================================================================
    // * PaginationTable 的設定
    // * ==========================================================================

    function setPaginationTable() {
        $('.paginationTable').each(function () {
            let $table = $(this);

            let param = {
                showNumber: 2,
                currentIndex: 1,
                totlePage: 0
            }

            param.totlePage = Math.ceil(($table.find('thead th').length - 1) / param.showNumber);

            $table.wrap(`<div class="paginationTable__wrap"></div>`);
            $table.before(`<div class="paginationTable__ctrl"><a href="javascript:;" class="paginationTable__btn paginationTable__btn-prev"></a><a href="javascript:;" class="paginationTable__btn paginationTable__btn-next"></a></div>`);

            $table.find('thead th').each(function (index) {
                if (index > 0) {
                    $(this).attr('data-column', index);
                }
            });

            $table.find('tbody tr').each(function () {
                let serialNumber = 1;

                $(this).find('th, td').each(function (index) {
                    let $this = $(this);
                    if (index === 0 && $this.attr('scope') === 'row') {
                        serialNumber = 0;
                    } else {
                        $this.attr('data-column', serialNumber);
                    }
                    serialNumber = serialNumber + 1;
                });
            });

            let $ctrlbar = $table.siblings('.paginationTable__ctrl');
            let $prevBtn = $ctrlbar.find('.paginationTable__btn-prev');
            let $nextBtn = $ctrlbar.find('.paginationTable__btn-next');

            function setTableVisible() {
                $prevBtn.removeClass('is-disable');
                $nextBtn.removeClass('is-disable');

                if (param.currentIndex <= 1) {
                    param.currentIndex = 1;
                }

                if (param.currentIndex >= param.totlePage) {
                    param.currentIndex = param.totlePage;
                }

                if (param.currentIndex === 1) {
                    $prevBtn.addClass('is-disable');
                } else if (param.currentIndex === param.totlePage) {
                    $nextBtn.addClass('is-disable');
                }

                ctrlPaginationTableVisible($table, param);
            }

            $prevBtn.on('click', function () {
                param.currentIndex = param.currentIndex - 1;
                setTableVisible();
            });

            $nextBtn.on('click', function () {
                param.currentIndex = param.currentIndex + 1;
                setTableVisible();
            });

            setTableVisible();
        });
    }

    function ctrlPaginationTableVisible(table, param) {
        table.find('th[data-column], td[data-column]').each(function () {
            let $this = $(this);
            let columnIndex = $this.data('column');
            let showItems = [];

            for (let i = 0; i < param.showNumber; i++) {
                showItems.push((param.showNumber * param.currentIndex) - i);
            }

            let isShow = showItems.some(function (item) {
                return item === columnIndex
            });

            if (isShow) {
                $this.removeClass('paginationTable__hide');
            } else {
                $this.addClass('paginationTable__hide');
            }
        });
    }

    setPaginationTable();

    // * ==========================================================================
    // * window 的 resize 事件
    // * ==========================================================================

    $window.on('resize', function () {
        screenWidth = $window.outerWidth();
        ctrlPocketTableColumn(screenWidth, pocketTable.breakpoint);
        ctrlSwipeTableNotice(screenWidth);
    }).trigger('resize');

});