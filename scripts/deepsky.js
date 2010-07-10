/*
 * Deepsky Starmaps by Stefan Liebenberg [stefan(at)artspace44(dot)com] is licensed 
 * under a Creative Commons Attribution-Noncommercial 2.5 South Africa License.
 * View the licence at http://creativecommons.org/licenses/by-nc/2.5/za/
 * Based on a work at http://stefan.artspace44.com/deepsky
 * Source files available at http://github.com/StefanLiebenberg/Deepsky-Starmaps
 */

$.fnFalse=function(){return false};
$.fnTrue=function(){return !$.fnFalse()};

$.fn.positionTo = function ( target, top, left ) {
  var pos = $( this ).position(), tar = $( target ).position();
  return $(this).css({
    left:pos.left-tar.left+parseInt(left),
    top:parseInt(top)-pos.top+tar.top
  })
};

$.fn.flag = function ( text, options ) {
  
  // setup defaults
  var settings = $.extend({
    left: 0, top: 0
  }, options || {} )
  
  // run for every element;
  return $(this).each(function(){
    // initialize target and flag elements;
    var target = $(this), flag = $(document.createElement( 'div' ))
        .addClass( 'flag' )
        .addClass( 'hidden' )
        .html( text );
    
    // add flag to DOM
    $( settings.parent||document.body )
      .append( flag );
        
    // align flag to target
    flag.positionTo(target,settings.top,settings.left); 
        
    // removed on and off functions from scope to fix memory leaks
    var on = $.fn.flag.fn_on(flag), off = $.fn.flag.fn_off(flag);
  
    // specify on/off behaviour
    target
      .mousemove(on)
      .mouseover(on)
      .mouseout(off);
  })
};

$.fn.flag.fn_on=function(flag){return function(){flag.removeClass('hidden')}};
$.fn.flag.fn_off=function(flag){return function(){flag.addClass('hidden')}};

$.fn.overlay = function (options) {
  return $(this).each(function(){
    var image = $( this ),
        overlay = $( new Image ).attr( 'src', image.attr( 'overlay' ) ),
        container = $( document.createElement( 'div' ) ),
        settings = {
          width: image.attr( 'width' ),
          height: image.attr( 'height' )
        };
    
    image.replaceWith( container );
 
    container
      .mousedown(function(){return false}) // disables the dragging effect /* LEAK 01 leaks: options, image, overlay, container, settings */
      .addClass( 'overlay' )
      .append( $( document.createElement( 'div' ) )
        .append( image )
        .append( overlay
          .css({
            position: 'relative',
            top: -settings.height,
            opacity: 0,
            width: settings.width,
            height: settings.height
          })
        )
        .css({
          width: settings.width,
          height: settings.height
        })
      )
      .append( $( document.createElement('div') )
        .slider({
          animate: true,
          step: 0.5,
          slide: function (event,ui) {  /* LEAK 02 leaks: options, image, overlay, container, settings */
            overlay.css('opacity', ui.value/100 )
            // image.css('opacity', 1 - (ui.value/100))
          }  
        })
        
      )
      .css({
        width: settings.width
      })
  })
}

$.fn.starmap = function () {
  return $(this).each(function() {
    var image = $( this ),
        container = $( document.createElement( 'div' ) ),
        map = $(xx="map[name="+image.attr( 'usemap' ).replace( /^.*#/,'' )+"]").first(),
        settings = {
          width: image.attr( 'width' ),
          height: image.attr( 'height' )
        }
          
    image.replaceWith( container );
    container
      .addClass( 'starmap' )
      .css({
        width: settings.width,
        height: settings.height
      })
      .append( image )
      .mousedown($.fnFalse);

    function hotzone( area, coords, options ){  /* LEAK 04 leaks: image,container,map,settings */
      
      var zone = $( document.createElement( 'div' ) )
          .addClass( 'hotzone' )
          .attr( 'style', $(area).attr( 'style' ) || '' )
          .css({
            height: coords[3] - coords[1],
            width: coords[2] - coords[0]
          })
          
      if( image.attr( 'overlay' ) ) {
        zone.css({
          background: x = "url(" + image.attr( 'overlay' ) + ") -" + coords[0] + 'px -' + (coords[1]+2) + 'px',
          border: '0px'
        })
      }
          
      container
        .append( zone );
      
      
      var p = container.position(), q = zone.position();
      
      zone.css({
        top: -(q.top - p.top) + coords[1],
        left: -(q.left - p.left) + coords[0]
      })
      
      var alt = $(document.createElement( 'div' ))
          .html( area.attr('alt') )
          .addClass('hovering-text')
          .addClass('hidden')
      
      container.append( alt );      
      var x = alt.position();      
      
     
      var o = alt.attr('offsetWidth'), l = coords[0] > ( settings.width - coords[2] ) ? coords[0] - o :  -( x.left - p.left) + coords[2];
      
      alt.css({
        top: -( x.top - p.top) + coords[1],
        left: Math.max( Math.min(l,settings.width-o), 0 )
      })
      
      var on = function(){   /* LEAK 05 leaks: image,container,map,settings, area, coords, options, zone, p, q, alt, x, o, l */
        $(this).addClass('hovering')
        alt.removeClass( 'hidden' )          
      }, of = function(){    /* LEAK 06 leaks: image,container,map,settings, area, coords, options, zone, p, q, alt, x, o, l */
        $(this).removeClass('hovering')
        alt.addClass( 'hidden' )
      };
      
      zone
       .mousemove(on)
       .mouseover(on)
       .mouseout(of)
       .wrap('<a href="'+area.attr('href')+'"></a>')
      
    }

    $( 'area', map ).each(function (){ 
      hotzone($(this), eval('['+$( this ).attr( 'coords' )+']'))
    })
    
    map.remove()
  })
}
