$(document).ready(initialize);

function initialize(){
    appendEmail();
    appendPhone();
    ensureAllLinksOpenNewWindow();
    enableMagnific();
    allowCollapseHamburger();
    allowTouchEvents();
    bindScrollEventHandler();
    contactFormHandler();
    applyAnimations();
}
function appendEmail(){
    var e = "mat";
    e += "t.a.den";
    e += "ney@";
    e += "gma";
    e += "il.";
    e += "com";
    var m = 'mai';
    m += 'lto:';
    $('#e').text(e).attr('href', `${m+=e}?subject=Position%20Available&#58;%20&body=Hi%20Donald&#44;%0A%0A%20I%20read%20your%20resume&#44;%20love%20it&#46;%20%20I%20wanted%20to%20reach%20out%20about%20an%20opportunity%20we%20have%20for%20you&#58;%0A%0A%0AThanks&#44;%0A%0A`)
}
// Appending Sensitive Information to prevent bot sniffing
function appendPhone(){
    var p = '71';
    p += '4-';
    p += '29';
    p += '6-';
    p += '39';
    p += '51';
    var t = 'te';
    t += 'l:';
    $('#p').text(p).attr('href', `${t+=p}`);
}

// Ensures all anchor tags linking to another web page, but doesn't open an app, opens in a new window
function ensureAllLinksOpenNewWindow(){
    const $links = $("a[href^='http'],a[href^='/']");
    $links.attr('target','_blank');
}

// Enables the AJAX loader when user clicks a popup link
function enableMagnific(){
    var over;
    $('.magnific').magnificPopup({
        type: 'ajax',
        ajax: {
            settings: null,
            cursor: 'mfp-ajax-cur',
            tError: '<a href="%url%">The content</a> could not be loaded.',
        },
        callbacks: {
            parseAjax: function(response){
                console.log('Ajax Content Loaded:',response)
            },
            ajaxContentAdded: function(){
                console.log(this.content)
            },
            open: function(){
                over = $('body').prop('overflow');
                console.log('popup opened', over);
                $('body').prop('overflow','hidden');
            },
            afterClose: function(){
                console.log("popup closed", over)
            }
        },
        gallery: {
            enabled: true
        },
        midClick: false,
        fixedContentPos: true,
        fixedBgPos: true,
        closeOnBgClick: false
    })
}


// Allowing user to close the hamburger button by clicking anywhere on screen
function allowCollapseHamburger() {
    $(document).click(function (event) {
        const clicktarget = $(event.target);
        const hamburger = $(".mobile-nav");
        const opened = hamburger.hasClass("active");
        if (opened && !clicktarget.hasClass("clearlist") && !clicktarget.hasClass("fa-bars") ) {
            hamburger.click();
        }
    });
}

// Allows tap events on mobile devices to trigger CSS hover events
function allowTouchEvents(){
    $('.work-item').on('touchstart',function(){})
}


/**
 * Handling Rotating Animation of the HTML/CSS icon.  This prevents the rotating animation
 * from happening before the user scrolls down to the Skills section.
 * This fixes the issue where if the animation happens after page load, then it will appear
 * on the DOM without regards to any other animations (nullifying libraries: wow.js and animate.css)
 */
function bindScrollEventHandler(){
    $(document).scroll(scrollEventHandler);
}
// Defining callback function that fires when the page is scrolled
function scrollEventHandler() {
    if(isScrolledIntoView($('.spinner')[0])) {
        unbindScrollEventHandler();
        beginRotateHeartbeat();
    }
}
// Checks if the DOM element has rendered in view of the viewport
function isScrolledIntoView(domelement) {
    const elemTop = domelement.getBoundingClientRect().top;
    const elemBottom = domelement.getBoundingClientRect().bottom;

    const isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
    return isVisible;
}
// Gets rid of the handler after the DOM element is viewable, so it doesn't keep needlessly firing
function unbindScrollEventHandler() {
    $(document).unbind('scroll', scrollEventHandler);
}
// Starts the heartbeat to rotate the HTML/CSS icon
function beginRotateHeartbeat(){
    const $spinner = $('.spinner');
    const $rotate = $(".txt-rotate");
    const animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

    // Removes conflicting properties created by initial spawn animation
    $rotate.one(animationEnd, function(){
        $(this).removeClass('wow slideInDown')
            .removeAttr('style');
        window.setTimeout(function(){
            $rotate.addClass('flipOutY') // duration is 0.75s
                .one(animationEnd, function() {
                    $(this).removeClass('flipOutY')
                        .addClass('rotateIn');
                    // Start spins after an initial delay
                    startSpins($spinner);
                });
        },2345);
    });


    function startSpins(spinner){
        spinner.addClass('spinning');
        // Sets pulse for the text rotation
        $rotate.textrotator({
            animation: "flipCube",
            separator: " / ",
            speed: 5555
        });
        // Sets pulse for the icon spinning
        window.setInterval(animate, 5555, spinner);

        function animate(spinner){
            spinner.hasClass('spinning') ? spinner.removeClass('spinning') : spinner.addClass('spinning');
        }
    }
}

// Creates Front-end Handler for the Contact form
function contactFormHandler(){
    // defining jQuery references for cleaner code
    const icon_ready = $('<i>').addClass("fa fa-paper-plane"); //maybe add this only when it passes instant validation
    const icon_sending = $('<i>').addClass("fa fa-spin fa-spinner"); //though i need to add instant validation first..
    const icon_sent = $('<i>').addClass("fa fa-check");
    const icon_fail = $('<i>').addClass("fa fa-times");
    const $submit = $("#submit_btn");
    const $alert = $("#result");
    const $forms = $('#contact_form input, #contact_form textarea');

    $submit.click(function(){
        $submit.find('.fa-paper-plane').attr('data-wow-duration','2s').addClass('wow rotateUpRight');
        //get input field values
        const user_name = $('input[name=name]').val().trim();
        const user_email = $('input[name=email]').val().trim();
        const user_message = $('textarea[name=message]').val().trim();

        //simple validation at client's end
        //we simply change border color to red if empty field using .css()
        var proceed = true;
        if (user_name === "") {
            $('input[name=name]').css('border-color', '#e41919');
            proceed = false;
        }
        if (user_email === "") {
            $('input[name=email]').css('border-color', '#e41919');
            proceed = false;
        }
        if (user_message === "") {
            $('textarea[name=message]').css('border-color', '#e41919');
            proceed = false;
        }
        // an easy way to test what happens when the server is unreachable
        if (user_message === 'server is down'){
            proceed = true;
        }
        //everything looks good! proceed...
        if (proceed) {
            //data to be sent to server
            var post_data = {
                'userName': user_name,
                'userEmail': user_email,
                'userMessage': user_message
            };

            $submit.addClass('disabled')
                .removeClass('btn-success btn-dangerous')
                .text('Sending... ')
                .append(icon_sending);
            setTimeout(checkFail,10000);
            //Ajax post data to server
            $.post('./php/contact_me_smtp.php', post_data, function(response){
                // fails due to some sort of server issue such as auth with with gmail SMTP or timeout
                if (response.type === 'error' && response.error === 'server') {
                    sendFailed(response.text);
                    window.mail = response.message;
                    return false;
                }
                else if (response.type === 'error' && response.error === 'client') {
                    // fails due to client not specifying the correct parameters
                    var output = '<div class="error">' + response.text + '</div>';
                    $submit.addClass('disabled btn-dangerous animated shake')
                        .text('Message not sent ')
                        .append(icon_fail);
                }
                else {
                    // success.  mail is sent and user sees confirmation
                    output = '<div class="success">' + response.text + '</div>';
                    $submit.addClass('btn-success animated flash')
                        .text('Sent! ')
                        .append(icon_sent);

                    //reset values in all input fields
                    $forms.val('');
                }
                $alert.hide().html(output).slideDown();
            }, 'json');

        }

        return false;
    });
    function sendFailed(text){
        const animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        const emailURL = $('#e').parent().parent().parent();

        $submit.toggleClass('submit_btn_dead btn-dangerous animated hinge')
            .text('Service Unavailable ')
            .attr('type','button')
            .append(icon_fail)
            .one(animationEnd, function(){
                $('#contact_form .clearfix').remove();
                $alert.hide().html('<div class="error">'+text+'</div>').slideDown();
                emailURL.addClass('animated rubberBand')
                    .one(animationEnd,function(){
                        emailURL.removeClass('animated rubberBand')
                            .addClass('animated tada');
                    })
            })
            .off('click');
        $forms.off('keyup').off('keypress');
    }
    function checkFail(){
        if ($submit.text() === "Sending... "){
            sendFailed("Sorry, this service is currently unavailable.  Please use the link above.");
        }
    }

    //allows user to submit form by pressing ctrl+enter on any field.
    $forms.keypress(function () {
        if (event.keyCode === 10)  $submit.click();
    });

    //reset previously set border colors and hide all message on .keyup() that isnt ctrl or enter
    $forms.keyup(function(){
        if (event.keyCode === 17 || event.keyCode === 13)
            return;
        $forms.css('border-color', '');
        $alert.slideUp();
        $submit.removeClass('disabled btn-dangerous animated shake flash')
            .text('Send Message ')
            .append(icon_ready);
    });
}
/**
 * Applies all animations from the animate.css and wow.js libraries, which apply animations through custom HTML attributes.
 * These functions result in cleaner HTML, though some animations are still hard coded in.
 */
function applyAnimations(){
    animateElement('section h2', 'slideInUp', .3);
    animateElement('#skills h3, #about blockquote', 'fadeIn', .3);
    animateChildren('.about-text',aboutParagraphs);
    animateChildren('.tpl-alt-tabs',skillsIcons);
    animateChildren('.ci-parent',contactIcons);
    animateChildren('.footer-social-links',footerIcons);
    // Generic helper function that applies an animation to a DOM element
    function animateElement(element, effect, delay, duration){
        const $element = $(element);
        // ES6 default function params are not supported on iOS9 or IE11
        if (!delay)     delay = 1;
        if (!duration)  duration = 1;
        $element.addClass('wow '+effect)
            .attr({
                "data-wow-delay": delay+"s",
                "data-wow-duration": duration+"s"
            })
    }
    // Generic helper function that applies animations to all children of a DOM element
    function animateChildren(parent, animation){
        const $parent = $(parent);
        $parent.each(function(){
            const $child = $(this).children();
            $child.each(animation)
        })
    }
    // Reference function for all the paragraphs in the About section
    function aboutParagraphs(index){
        animateElement(this, "fadeIn", "0."+(index*2-1), .6);
    }
    // Reference function for all the skills icons and their titles
    function skillsIcons(index){
        animateElement(this, "flipInX", "0."+(index+2), .4);
        animateElement($(this).find('p'), "slideInDown", .8, .6);
    }
    // Reference function for all the contact-info icons
    function contactIcons(){
        animateElement(this, "rollIn", .2, 1.2)
    }
    // Reference function for all the footer icons
    function footerIcons(index){
        const duration = .6;
        var delay = (index+1)*duration/2;
        animateElement(this, "flip", delay,duration);
    }
}