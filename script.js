// Data
var images = [
      'images/gm-mangrove-cay.jpg',
      'images/gm-kansas.jpg',
      'images/gm-airliebeach.jpg'
]; 

// GLobal
var isPlaying,
dis_filter,
dis_img,
slides = {},
slideshow,
current_slide,
current_index = 0,
is_animating=false;

//  Get the canvas
var canvas_container = document.getElementById('dis_slider');

// Init size
var bg_size = {w:2000,h:1125};
var ratio = bg_size.w/bg_size.h;
canvas_container.width   = window.screen.width;
canvas_container.height  = window.screen.height;

// Init pixi
var app = new PIXI.Application({width:canvas_container.width,height:canvas_container.height, backgroundColor: 0xdddddd });
canvas_container.appendChild(app.view);

// load images
var loader = new PIXI.Loader();
for(var i=0; i < images.length; i++){
    loader.add('img_'+i, images[i]);
}
loader.add('img_dis', 'images/dis/4_512x512.jpg');	  

// On images load start the awsome
loader.load(function(loader, resources){
    
      slideshow = new PIXI.Container();	
      dis_img = new PIXI.Sprite.from(resources.img_dis.url);

      for(var key in resources){
        if (resources.hasOwnProperty(key)) { 
            if(key !== "dis_img"){
                slides[key] =  new PIXI.Sprite.from(resources[key].url);
                slides[key].sps_filter = new PIXI.filters.DisplacementFilter(dis_img);
                slides[key].filters = [slides[key].sps_filter];
            }
        }
      }
      // Repeat displacement image (need to be powers of two image )
      dis_img.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.MIRRORED_REPEAT;

      // Add first slide
      TweenMax.set(slides.img_0.sps_filter.scale, { x: 0, y: 0 } );
      slideshow.addChild(slides.img_0);
      
      //TweenMax.set(slides.img_0.position,{x:-100})

      // set filter defaut value and append to slideshow
      //dis_filter  = new PIXI.filters.DisplacementFilter(dis_img);
      //dis_filter_02  = new PIXI.filters.DisplacementFilter(dis_img);

      // Add slideshow to the stage
      app.stage.addChild(slideshow);

      window.sps_goto = function( newIndex ) {

            if(is_animating) return;
      
            if(current_index === newIndex) return;
            
            is_animating = true;
            current_index = newIndex;
            newIndex = slides['img_'+newIndex];
            console.log(slides)
            if(typeof current_slide == "undefined"){
                current_slide = slides.img_0;
            }

            var current_filter = current_slide.sps_filter;
            var next_filter = newIndex.sps_filter;
         
            TweenMax.set(current_filter.scale, { x: 0, y: 0 } );
            TweenMax.set(next_filter.scale, { x: -300, y: -300 } );

            //current_slide.filters = [dis_filter];
            //newIndex.filters = [dis_filter_02];

            slideshow.addChild(newIndex);
            TweenMax.set(newIndex, { alpha: 0 }) 
            TweenMax.set(newIndex.position,{x:0})
            var tl = new TimelineMax();  
            var tl2 = new TimelineMax();
            
            // animate
            TweenMax.to(current_filter.scale, 1.6, { x: 300, y: 300, ease:Expo.easeOut})
            TweenMax.to(next_filter.scale, 1.6, {  x: 0, y: 0, ease:Expo.easeOut})
            
           //tl.to(dis_filter, 0.6, { scaleX: 50, positionX: -100, ease:Linear.easeNone})
             //.to(dis_filter, 0.6, { scaleX: 0, positionX: -100, ease:Linear.easeNone})
      
            tl2.to(newIndex, .8, { delay:0.2, alpha: 1 }) 
               .to(current_slide, 0, { alpha: 0 ,onComplete:function(){
                  current_slide = newIndex;
                  is_animating = false;
            }}) 
            
            /*
            TweenMax.to(current_slide.position, 1, {x:-200,ease:Power2.easeOut , onComplete:function(){
                  TweenMax.set(current_slide.position,{x:0})
            }}); 
            TweenMax.to(newIndex.position, 1, {x:-100,ease:Power2.easeOut,onComplete:function(){
                  is_animating = false;
            }}); 
            */
            
            
               
      };
      
   
});


