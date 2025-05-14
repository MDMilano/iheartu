document.addEventListener('DOMContentLoaded', () => {
    const iLetter = document.querySelector('.i-letter');
    const loveText = document.querySelector('.love-text');
    const youText = document.querySelector('.you-text');
    const uLetter = document.querySelector('.u-letter');
    const heart = document.querySelector('.heart');
    const leftLine = document.querySelector('.left-line');
    const rightLine = document.querySelector('.right-line');

    const lineDuration = 0.8;
    const popDuration = 0.4;
    const stateDelay = 1.5;
    const fontSize = {
        normal: '28px',
        heart: '35px',
        mobile: {
            normal: '22px',
            heart: '29px'
        },
        small: {
            normal: '18px',
            heart: '25px'
        }
    };

    function setResponsiveSizes() {
        if (window.innerWidth <= 320) {
            fontSize.current = fontSize.small;
        } else if (window.innerWidth <= 480) {
            fontSize.current = fontSize.mobile;
        } else {
            fontSize.current = {
                normal: fontSize.normal,
                heart: fontSize.heart
            };
        }
    }

    setResponsiveSizes();
    window.addEventListener('resize', setResponsiveSizes);

    const masterTimeline = gsap.timeline();

    function initElements() {
        gsap.set([iLetter, loveText, youText, uLetter, heart], {
            opacity: 0,
            fontSize: 0,
            scale: 0.5
        });

        gsap.set([leftLine, rightLine], {
            height: 0
        });

        heart.style.display = 'none';
        uLetter.style.display = 'none';
        iLetter.style.display = 'inline-block';
        loveText.style.display = 'inline-block';
        youText.style.display = 'inline-block';
    }

    function animateLines(timeline, height) {
        timeline.to([leftLine, rightLine], {
            height: height,
            duration: lineDuration,
            ease: "power2.inOut"
        });
    }

    function popInElement(timeline, element, fontSize) {
        timeline.to(element, {
            opacity: 1,
            fontSize: fontSize,
            scale: 1,
            duration: popDuration,
            ease: "back.out(1.7)"
        });
    }

    function popOutElement(timeline, element) {
        timeline.to(element, {
            opacity: 0,
            scale: 1.2,
            duration: popDuration / 1.5,
            ease: "back.in(1.7)",
            onComplete: () => {
                element.style.display = 'none';
            }
        });
    }

    function runAnimation() {
        masterTimeline.clear();
        initElements();
        
        const tl = gsap.timeline();
        
        animateLines(tl, '100px');
        
        tl.addLabel("showILoveYou");
        popInElement(tl, iLetter, fontSize.current.normal);
        popInElement(tl, loveText, fontSize.current.normal);
        popInElement(tl, youText, fontSize.current.normal);
        
        tl.to({}, { duration: stateDelay });
        
        tl.addLabel("showIHeartYou");
        popOutElement(tl, loveText);
        tl.add(() => {
            heart.style.display = 'inline-block';
        });
        popInElement(tl, heart, fontSize.current.heart);
        
        tl.to({}, { duration: stateDelay });
        
        tl.addLabel("showIHeartU");
        popOutElement(tl, youText);
        tl.add(() => {
            uLetter.style.display = 'inline-block';
        });
        popInElement(tl, uLetter, fontSize.current.normal);
        
        tl.to({}, { duration: stateDelay });
        
        tl.addLabel("showOnlyHeart");
        popOutElement(tl, iLetter);
        popOutElement(tl, uLetter);
        
        tl.to([leftLine, rightLine], {
            height: 0,
            duration: lineDuration,
            ease: "power2.inOut"
        }, "-=0.3");
        
        tl.to(heart, {
            fontSize: parseInt(fontSize.current.heart) * 3 + 'px',
            duration: popDuration,
            ease: "power2.out"
        });
        
        tl.to({}, { duration: stateDelay * 1 });
        
        tl.addLabel("reset");
        popOutElement(tl, heart);
        
        tl.to({}, { 
            duration: 0.5,
            onComplete: runAnimation
        });
        
        masterTimeline.add(tl);
    }

    runAnimation();
});