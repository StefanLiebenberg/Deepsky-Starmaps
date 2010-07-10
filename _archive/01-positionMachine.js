
  settings.placement = settings.placement.replace(/(^\s*)|(\s*$)/g, '' ); // strip white spaces
  
  if( settings.placement == "" )
    settings.placement = 'center';

  if( settings.placement.match( /^(left|center|right)$/ ) )
    settings.placement = 'center ' + settings.placement;

  if( settings.placement.match( /^(top|bottom|center)(\s)+(left|center|right)$/ ) )
    settings.placement = 'inside ' + settings.placement;


  if(! settings.placement.match( /^(in|out)side\s+(top|bottom|center)\s+(left|center|right)$/ ) )
   settings.placement = 'inside center center';

top.positionMachine = (function(){
  return function (element,target,placement){
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
