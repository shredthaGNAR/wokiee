/*
The GPU License
Copyright (c) 2021 p-themes
https://themeforest.net/user/p-themes
*/


function scrollwidgetsInit(){
  var $scrollwidget = $(".scrollwidget");
  if(!$scrollwidget.length) return false;

  $('.aside.leftColumn').addClass('withpricerage');

  $scrollwidget.each(function(){
    scrollwidgetInit($(this));
  })
}
function scrollwidgetInit($scrollwidget){
  var $minf = $scrollwidget.find('input').first(),
      $maxf = $scrollwidget.find('input').last(),
      $scrollline = $scrollwidget.find('.scrollwidget_scroll_line'),
      $scrolllineactive = $scrollwidget.find('.scrollwidget_scroll_active'),
      $minb = $scrollwidget.find('.scrollwidget_scroll_btn__left'),
      $maxb = $scrollwidget.find('.scrollwidget_scroll_btn__right'),
      minv = Number($scrollwidget.attr('data-min')),
      maxv = Number($('.currentmaxpriceinwidget').text().match(/\d+/g)[0]),
      widthb = $minb.outerWidth(),
      inputtimer = false,
      mainmaxval = Number($scrollwidget.attr('data-max')),
      scale = mainmaxval/maxv;

  function setInputDataValue($this,val){
    $this.attr('data-value', Math.round(val));
  }
  $minf.on('input change keypress change.start', function(e){
    if(e.type == 'keypress') return !(event.charCode == 46 || event.charCode == 69 || event.charCode == 101);

    if("namespace" in e){
      $(this).val(Math.round($(this).attr('data-value')/scale));
    }

    var val = Number($(this).val());
    if($scrollline.length){
      var scrollwidth = $scrollline.width()-widthb*2,
          maxval = scrollwidth/(maxv-minv),
          pos = Math.min(Math.round(maxval*(val-minv)), $maxb.position().left-widthb),
          pos = Math.max(0, pos);
    }
    if(!("namespace" in e)){
      setInputDataValue($(this), $(this).val()*scale);
    }

    if(Number($(this).attr('data-value')) > Number($maxf.attr('data-value'))){
      $(this).val($maxf.val());
      setInputDataValue($(this), $(this).val()*scale);
    }

    if(!$(this).is(':focus')) val < minv && $(this).val(minv);
    $minb.length && $minb.css('left', pos);
    setScrolllineactiveWidth();

    if(!("namespace" in e) && e.type != 'change'){
      clearTimeout(inputtimer);
      inputtimer = setTimeout(function(){$(window).trigger('pricechangestate', [$scrollwidget])}, 1000);
    }

    $(this).val() == 0 && $(this).val('');
  });

  $maxf.on('input change keypress change.start', function(e){
    if(e.type == 'keypress') return !(event.charCode == 46 || event.charCode == 69 || event.charCode == 101);

    if("namespace" in e){
      var num = Number($(this).attr('data-value'));
      var num2 = Math.round(num/scale);
      $(this).val(Math.round(num/scale));
    }

    var val = Number($(this).val());

    if($scrollline.length){
      var scrollwidth = $scrollline.width()-widthb*2,
          maxval = scrollwidth/(maxv-minv),
          pos = Math.min(Math.round(maxval*(val-minv)+widthb), $scrollline.width()-widthb),
          pos = Math.max($minb.position().left+widthb, pos);
    }

    if(!("namespace" in e)){
      setInputDataValue($(this), $(this).val()*scale);
    }

    val > maxv && $(this).val(maxv);
    if(!$(this).is(':focus')) val < $minf.val() && $(this).val($minf.val());
    $maxb.length && $maxb.css('left', pos);
    setScrolllineactiveWidth();

    if(!("namespace" in e) && e.type != 'change'){
      clearTimeout(inputtimer);
      if(val >= $minf.val()){
        inputtimer = setTimeout(function(){$(window).trigger('pricechangestate', [$scrollwidget])}, 1000);
      }
    }      
  });

  $minb.on('mousedown touchstart', function(e){	
    e.preventDefault();
    var $this = $(this),
        mousedelta = $this.offset().left - (e.type == 'touchstart' ? e.originalEvent.targetTouches[0].clientX : e.clientX),
        widgetpos = $scrollline.offset().left,
        scrollwidth = $scrollline.width()-widthb*2,
        datawidth = $maxb.position().left-widthb;

    $(window).on('mousemove.scrolldrag touchmove.scrolldrag', function(e){
      var mousemove = e.type == 'touchmove' ? e.originalEvent.targetTouches[0].clientX : e.clientX,
          pos = Math.max(0, mousemove-widgetpos+mousedelta),
          pos = Math.min(pos, datawidth),
          maxval = (maxv-minv)/scrollwidth,
          fmaxval = Number($maxf.val()),
          val = Math.round(maxval*pos)+minv;
      val = val > fmaxval ? fmaxval : val;
      $this.css('left', pos);
      $minf.val(val);
      setInputDataValue($minf, val*scale);
      setScrolllineactiveWidth();
    });
    $(window).on('mouseup.scrolldrag touchend.scrolldrag', function(){
      $(window).unbind('mousemove.scrolldrag touchmove.scrolldrag');
      $(window).unbind('mouseup.scrolldrag touchend.scrolldrag');
      $(window).trigger('pricechangestate', [$scrollwidget]);
    });
  })

  $maxb.on('mousedown touchstart', function(e){
    e.preventDefault();
    var $this = $(this),
        mousedelta = $this.offset().left - (e.type == 'touchstart' ? e.originalEvent.targetTouches[0].clientX : e.clientX),
        widgetpos = $scrollline.offset().left,
        scrollwidth = $scrollline.width()-widthb*2,
        datawidth = $minb.position().left + widthb;

    $(window).on('mousemove.scrolldrag touchmove.scrolldrag', function(e){
      var mousemove = e.type == 'touchmove' ? e.originalEvent.targetTouches[0].clientX : e.clientX,
          pos = Math.max(datawidth, mousemove-widgetpos+mousedelta),
          pos = Math.min(pos, $scrollline.width()-widthb),
          maxval = (maxv-minv)/scrollwidth,
          fmaxval = Number($minf.val()),
          val = Math.round(maxval*(pos-widthb))+minv;

      val = val < fmaxval ? fmaxval : val;
      $this.css('left', pos);
      $maxf.val(val);
      setInputDataValue($maxf, val*scale);
      setScrolllineactiveWidth();
    });
    $(window).on('mouseup.scrolldrag touchend.scrolldrag', function(){
      $(window).unbind('mousemove.scrolldrag touchmove.scrolldrag');
      $(window).unbind('mouseup.scrolldrag touchend.scrolldrag');
      $(window).trigger('pricechangestate', [$scrollwidget]);
    });
  });
  $(window).on('resetscrollwidget', function(){
    $minf.val($minf.attr('data-value', minv)).val(minv).trigger('change.start');
    $maxf.val($maxf.attr('data-value', mainmaxval)).val(maxv).trigger('change.start');
  })
  function setScrolllineactiveWidth(){
    if(!$scrolllineactive.length) return false;
    $scrolllineactive.css({left: $minb.position().left+$minb.width()-3, right: $scrollline.width()-$maxb.position().left-3});
  }
  function updateWidget(){
    $minf.trigger('change.start');
    $maxf.trigger('change.start');
  }

  $(window).on('setnewcurrencyinprogress',function(){
    maxv = $('.currentmaxpriceinwidget').text().match(/\d+/g)[0];
    scale = mainmaxval/maxv;
    $minf.trigger('change.start');
    $maxf.trigger('change.start');
  });
  $(".tt-filters-options").length && $('.tt-filters-options').find('.tt-btn-toggle').on('click', function(){
    setTimeout(updateWidget, 0);
  });

  updateWidget();
  $(window).resize(updateWidget);
}


scrollwidgetsInit();