/*
 * Deepsky Starmaps by Stefan Liebenberg [stefan(at)artspace44(dot)com] is licensed 
 * under a Creative Commons Attribution-Noncommercial 2.5 South Africa License.
 * View the licence at http://creativecommons.org/licenses/by-nc/2.5/za/
 * Based on a work at http://stefan.artspace44.com/deepsky
 * Source files available at http://github.com/StefanLiebenberg/Deepsky-Starmaps
 */

top.positionMachine = (function(){
  return function positionMachine( element, target, placement ) {
    var elPos=element.position(),tgPos=target.position(),l,t
    if(placement.match(/^outside\s+(center\s+)?left$/))
      l = ( elPos.left - tgPos.left ) - element.width();
    else if (placement.match(/^((out|in)side\s)?(top|bottom)\s+left$/)||placement.match(/^(inside\s+)?(center\s+)?left$/))
      l = elPos.left - tgPos.left;
    else if ( placement.match(/^((in|out)side\s+)?(top|center|bottom)(\s+center)?$/) ) 
      l = ( elPos.left - tgPos.left ) + ( target.width() / 2 ) - ( element.width() / 2 );
    else if ( placement.match(/^((in|out)side\s+)?((top|bottom)\s+)?right$/)||placement.match(/(inside\s+)(center\s+)?right/))
      l = ( elPos.left - tgPos.left ) + target.width() - element.width();
    else if ( placement.match(/^(outside)\s+(center\s+)?right/))
      l = ( elPos.left - tgPos.left ) + target.width();
    if(placement.match(/^outside\s+top(\s+(left|center|right))?$/))
      t =  - ( elPos.top - tgPos.top ) - element.height() ;
    else if(placement.match(/^(inside\s+)?top(\s+(left|center|right))?$/))
      t =  - ( elPos.top - tgPos.top ) ;
    else if(placement.match(/^((in|out)side\s+)?center(\s+(left|center|right))?$/))
      t = -(elPos.top - tgPos.top ) + (target.height() / 2 ) - (element.height() / 2 );
    else if(placement.match(/^(inside\s+)?bottom(\s+(left|center|right))?$/))
      t =  -(elPos.top - tgPos.top ) + target.height() - element.height() ;
    else if(placement.match(/^outside\s+bottom(\s+(left|center|right))?$/))
      t =  -( elPos.top - tgPos.top ) + target.height();
    return {left:l||0,top:t||0};    
}
})();
 

$.fn.flag = function ( text, options ) {
  
  var settings = $.extend({
    left: 0, top: 0,
    placement: 'inside center center' // or 'outside' { inside outside } { left, right, middel } { top bottom middle }
  }, options || {} )

  
  settings.placement = settings.placement.replace(/(^\s*)|(\s*$)/g, '' ); // strip white spaces
  
  if( settings.placement == "" )
    settings.placement = 'center';

  if( settings.placement.match( /^(left|center|right)$/ ) )
    settings.placement = 'center ' + settings.placement;

  if( settings.placement.match( /^(top|bottom|center)(\s)+(left|center|right)$/ ) )
    settings.placement = 'inside ' + settings.placement;


  if(! settings.placement.match( /^(in|out)side\s+(top|bottom|center)\s+(left|center|right)$/ ) )
   settings.placement = 'inside center center';
  
  
  return $(this).each(function(){
    var target = $(this), pos = target.position();
    
    var flag = $(document.createElement( 'div' ))
        .addClass( 'flag' )
        .addClass( 'hidden' )
        .html( text )
    
    $( document.body ).append( flag );
        
   flag.css( positionMachine( flag, target, settings.placement ) );
    
    
    
//    var left, top;
     /* A - OUTSIDE
     * 
     * > outside [center] left 
     * 
     * alt.left = left - alt.width;
     */
  //  if( settings.placement.match(/^(outside)\s+(center)?\s+(left)$/) )
   //   left = pos.left - flag.width();
      
    
    /* A - INSIDE 
     * 
     * > [outside|inside] top|bottom left
     * > [inside] left
     * 
     * alt.left = left
     */
    // else if ( settings.placement.match(/^(outside|inside)?\s+(top|bottom)\s+left$/) || settings.placement.match(/^(outside|inside)?\s+(top|bottom)\s+left$/) || 
      
    
    
    
    
    
    
   
    
    
    
     
     /* B 
      * 
      * > [inside|outside] [center] top|center|bottom
      * 
      * alt.left = left + ( width / 2) - ( alt.width / 2 )
      */
    
    
    /* C - INSIDE 
     * 
     * > [outside|inside] top|bottom right
     * > [inside] right
     * 
     * alt.left = left + width - alt.width
     */
       
    /* C - OUTSIDE
     * 
     * > outside [center] right 
     * 
     * alt.left = left - alt.width;
     */
    
     
    
    
      
    
    
    /*
     * INSIDE:
     * 
     * A1 < top, left >
     * A2 < top, left + ( width / 2 ) - ( alt.width / 2 ) >
     * A3 < top, left + width - ( alt.width ) >
     * 
     * B1 < top + ( height / 2 ) - ( alt.height / 2 ), left >
     * B2 < top + ( height / 2 ), left + ( width / 2 ) - ( alt.width / 2 ) >
     * B3 < 
     */
    
    
    /*
    if ( settings.placement == 'inside' ) {
      flag.css({
        left: pos.left + settings.left,
        top: pos.top + settings.top
      })
    }
    
    if( settings.placement == 'outside' ) {
      flag.css({
        left: pos.left + target.width(),
        top: pos.top
      })
    }
    */
    
    
    function on (){
      flag.removeClass( 'hidden' )          
    }
    
    function of () {
      flag.addClass( 'hidden' )
    };
  
    target
      .mousemove(on)
      .mouseover(on)
      .mouseout(of)
        
  })  
}


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
      .mousedown(function(){return false}); /* LEAK 03 leaks: image,container,map,settings */

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
