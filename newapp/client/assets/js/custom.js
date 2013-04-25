
/* ---------- @ Main slider -----------*/
jQuery.noConflict()(function($){
		$(window).load(function() {
			$('.flexslider').flexslider({
				animation: "fade",             //String: Select your animation type, "fade" or "slide"
				slideDirection: "horizontal",   //String: Select the sliding direction, "horizontal" or "vertical"
				slideshow: true,                //Boolean: Animate slider automatically
				slideshowSpeed: 7000,           //Integer: Set the speed of the slideshow cycling, in milliseconds
				animationDuration: 600,         //Integer: Set the speed of animations, in milliseconds
				directionNav: false,             //Boolean: Create navigation for previous/next navigation? (true/false)
				controlNav: true,               //Boolean: Create navigation for paging control of each clide? Note: Leave true for manualControls usage
				keyboardNav: true,              //Boolean: Allow slider navigating via keyboard left/right keys
				mousewheel: false,              //Boolean: Allow slider navigating via mousewheel
				prevText: "",           //String: Set the text for the "previous" directionNav item
				nextText: "",               //String: Set the text for the "next" directionNav item
				pausePlay: false,               //Boolean: Create pause/play dynamic element
				pauseText: '',             //String: Set the text for the "pause" pausePlay item
				playText: 'Play',               //String: Set the text for the "play" pausePlay item
				randomize: false,               //Boolean: Randomize slide order
				slideToStart: 0,                //Integer: The slide that the slider should start on. Array notation (0 = first slide)
				animationLoop: true,            //Boolean: Should the animation loop? If false, directionNav will received "disable" classes at either end
				pauseOnAction: true,            //Boolean: Pause the slideshow when interacting with control elements, highly recommended.
				pauseOnHover: false,            //Boolean: Pause the slideshow when hovering over slider, then resume when no longer hovering
				controlsContainer: "",          //Selector: Declare which container the navigation elements should be appended too. Default container is the flexSlider element. Example use would be ".flexslider-container", "#container", etc. If the given element is not found, the default action will be taken.
				manualControls: "",             //Selector: Declare custom control navigation. Example would be ".flex-control-nav li" or "#tabs-nav li img", etc. The number of elements in your controlNav should match the number of slides/tabs.
				start: function(){},            //Callback: function(slider) - Fires when the slider loads the first slide
				before: function(){},           //Callback: function(slider) - Fires asynchronously with each slider animation
				after: function(){},            //Callback: function(slider) - Fires after each slider animation completes
				end: function(){}
			});
		});
		});

/* ---------- @ Pretty photo -----------*/
jQuery.noConflict()(function($){
$(document).ready(function() {  

$("a[data-rel^='prettyPhoto']").prettyPhoto({opacity:0.80,default_width:200,default_height:344,theme:'facebook',hideflash:false,modal:false});

});
});

/* ---------- @ Google Maps -----------*/

jQuery.noConflict()(function($){

   $('#map-contact').gMap({
        address: "Quito, Ecuador",
        zoom: 14,
		markers:[
			{
				latitude: -2.2014,
				longitude: -80.9763,
				html: "_latlng"
			},
			{
				address: "Guayaquil, Ecuador",
				html: "My Hometown",
				popup: true
			},
			{
				address: "Galapagos, Ecuador",
				html: "_address"
			}
		]
    });
	
	
	

});

/* ---------- @ Portfolio -----------*/
jQuery.noConflict()(function($){
$('#portfoliopage').click(function(){

$(document).ready(function() {  
var $container = $('#portfolio');
		


				
				// initialize isotope
				$container.isotope({
				  itemSelector : '.block',
				  layoutMode : 'fitRows',
				  
				});
				// filter items when filter link is clicked
				$('#filters a').click(function(){
				  var selector = $(this).attr('data-filter');
				  $container.isotope({ filter: selector });
				  $(this).parent().addClass('current').siblings().removeClass('current');
				  return false;
				});

				

});
});

});

/* ---------- @ Contact From -----------*/

jQuery.noConflict()(function($){
$(document).ready(function ()
{ // 
    $("#ajax-contact-form").submit(function ()
    {
        //
        var str = $(this).serialize(); // 
        $.ajax(
        {
            type: "POST",
            url: "contact.php",
            data: str,
            success: function (msg)
            {
                $("#note").ajaxComplete(function (event, request, settings)
                {
                    if (msg == 'OK') //
                    {
                        result = '<div class="notification_ok">Message was sent to website administrator, thank you!</div>';
                        $("#fields").hide();
                    }
                    else
                    {
                        result = msg;
                    }
                    $(this).html(result);
                });
            }
        });
        return false;
    });
});
});
/* ---------- @ testiominals -----------*/
jQuery.noConflict()(function($){
		$(window).load(function() {
				
				jQuery('#testiominals').carouFredSel({
					responsive  : true,
					items: {
							visible		: {
								min			: 1,
								max			: 1
							},
							width: 300,
							
						},
					scroll: 1,
					auto : {
							easing		: "linear",
							duration	: 1000,
							timeoutDuration: 4000,
							pauseOnHover: true
							},
					prev : "#works-scroll-prev",
					next : "#works-scroll-next",
					
				});	
				
				});
		});