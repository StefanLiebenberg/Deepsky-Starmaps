$.fn.overlay = function (options) {
  return $(this).each(function(){
    var image = $( this ),
        overlay = $( new Image ).attr( 'src', image.attr( 'overlay' ) ),
        container = $( document.createElement( 'div' ) ),
        settings = {
          width: image.attr( 'width' ),
          height: image.attr( 'height' )
        }
    
    image.replaceWith( container );
 
    container
      .mousedown(function(){return false})
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
          slide: function (event,ui) {
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
      .mousedown(function(){return false});

    function hotzone( area, coords, options ){
      
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
      
      var on = function(){
        $(this).addClass('hovering')
        alt.removeClass( 'hidden' )          
      }, of = function(){
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
