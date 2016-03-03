/**
 * TODO:
 * When select show prices buttons, scroll page smoothly down to button and change button text to "Hide prices and details".
 * Google Analytics
 * Add to Github
 * Custom github pages domain
 * Get facebook like box code from Amanda - also get her to sign up for Google and share.
 * Implement scroll watch.
 * Remove uneeded bootstrat plugins.
 */

var SecretTherapist = (function ($) {
    'use strict';

    var module              = {};
    // Debug flag
    var debugMode = false,

    // scroll tracking properties
        bottom,
        height,

    // Default time delay before checking location
        callBackTime = 100,

    // # px before tracking a reader
        readerLocation = 50,

    // Set some flags for tracking & execution
        timer = 0,
        scroller = false,
        servicesVisited = false,
        newsVisited = false,
        contactVisited = false,
        didComplete = false,

    // Set some time    ables to calculate reading time
        startTime = new Date(),
        beginning = startTime.getTime(),
        totalTime = 0,

    // Get some information about the current page
        pageTitle = document.title;

    // Track the aticle load
    if (!debugMode) {
        // _gaq.push(['_trackEvent', 'Reading', 'ArticleLoaded', '', , true]);
        ga('send','event','reading','ArticleLoaded',null);
    } else {
        console.log('The page has loaded. Woohoo.');
    }

    var logSectionVisit = function (sectionTitle) {
        // console.log('startTime: '+startTime);
        var currentTime = new Date();
        // console.log('currentTime: '+currentTime);
        var contentScrollEnd = currentTime.getTime();
        // console.log('contentScrollEnd: '+contentScrollEnd);
        var timeToContentEnd = Math.round((contentScrollEnd - startTime) / 1000);
        //console.log('timeToContentEnd: '+timeToContentEnd);

        if (!debugMode) {
            // _gaq.push(['_trackEvent', 'Reading', 'ContentBottom', '', timeToContentEnd]);
            ga('send','event','reading',sectionTitle, timeToContentEnd);
        } else {
            console.log('visited section: '+sectionTitle + ' - ' +timeToContentEnd);
        }
    };

    var isScrolledIntoView = function (elem)
    {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();

        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(elem).height();

        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }

    // Check the location and track user
    var trackLocation = function () {
        var bottom = $(window).height() + $(window).scrollTop(),
            height = $(document).height(),
            currentTime = new Date(),
            scrollStart = currentTime.getTime();

        // If user has hit the bottom of the content send an event
        if (isScrolledIntoView($('.st-container-services')) && !servicesVisited) {
            logSectionVisit('Services');
            servicesVisited = true;
        }
        else if (isScrolledIntoView($('.st-container-news')) && !newsVisited) {
            logSectionVisit('News');
            newsVisited = true;
        }
        else if (isScrolledIntoView($('.st-container-contact')) && !contactVisited) {
            logSectionVisit('Contact');
            contactVisited = true;
        }

        // If user starts to scroll send an event
        if (bottom > readerLocation && !scroller) {
            var timeToScroll = Math.round((scrollStart - beginning) / 1000);
            if (!debugMode) {
                // _gaq.push(['_trackEvent', 'Reading', 'StartReading', '', timeToScroll]);
                ga('send','event','reading','Services', timeToScroll);
            } else {
                console.log('started reading ' + timeToScroll);
            }
            scroller = true;
        }



        // If user has hit the bottom of page send an event
        if (bottom >= height && !didComplete) {
            var totalTime = Math.round((currentTime - scrollStart) / 1000);
            if (!debugMode) {
                ga('send','event','reading','PageBottom', pageTitle, totalTime);
            } else {
                console.log('bottom of page '+totalTime);
            }
            didComplete = true;
        }
    }



    var WriteGoogleMap = function () {
        var docfrag = document.createDocumentFragment(),
            mapContainer = document.getElementById('map-container'),
            iframe = document.createElement('iframe');
            // console.log(mapContainer);
        iframe.id = 'ECL-glossary-header-id';
        iframe.src = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d17855.10253787981!2d-4.5736996!3d55.985972849999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x488852c266b0e445%3A0xae5144f592972238!2sAlexandria%2C+West+Dunbartonshire!5e0!3m2!1sen!2suk!4v1406761568129';
        iframe.width = '100%';
        iframe.height = '300';
        iframe.style.borderWidth = 0;
        docfrag.appendChild(iframe);
        mapContainer.appendChild(docfrag);
    };

    var LoadFaceBook = function () {
        (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = "//connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.0&appId=269189373267951";
                fjs.parentNode.insertBefore(js, fjs);
              }(document, 'script', 'facebook-jssdk'));

              $(window).bind("load resize", function(){
                var container_width = $('#st-container-facebook').width();
                // console.log(container_width);
                  $('#st-container-facebook').html('<div class="fb-like-box" ' +
                  'data-href="https://www.facebook.com/pages/The-Secret-Therapist/249974268531827"' +
                  ' data-width="' + container_width + '" data-height="371" data-show-faces="false" data-header="false" data-show-border="false" ' +
                  'data-stream="true" data-header="true"></div>');
                  FB.XFBML.parse( );
              });
    };

    var IEReplaceSVGPNG = function () {
        $('img[src*="svg"]').attr('src', function() {
            return $(this).attr('src').replace('.svg', '.png');
        });
    };

    var gaCustomEvents = function () {
        $('a').click(function() {
              ga('send','event','Button',$(this).prop('href'),null);
        });
    };

    module.init = function () {
        if(!Modernizr.svg) {
            IEReplaceSVGPNG();
        }
        gaCustomEvents();
        WriteGoogleMap();
        LoadFaceBook();


    };

    // Track the scrolling and track location
    $(window).scroll(function() {
        if (timer) {
            clearTimeout(timer);
        }
        // Use a buffer so we don't call trackLocation too often.
        timer = setTimeout(trackLocation, callBackTime);
    });

    return module;

}($));


SecretTherapist.init();
