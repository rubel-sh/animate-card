// API Available to use:
// data-ac="tilt" - Required attribute to initialize the tilt effect
// data-ac-angle="10" - Optional attribute to set the tilt angle. Default value is 5
// data-ac-gravity="negative" - Optional attribute to set the tilt direction. Default value is negative
// data-ac-perspective="1000" - Optional attribute to set the perspective value. Default value is 1000


document.addEventListener("DOMContentLoaded", () => {
  const _gravityOptions = {
    positive: "positive",
    negative: "negative",
  };

  const tiltCards = document.querySelectorAll("[data-ac='tilt']") || [];
  const PARENT_CLASS_NAME = "ac-perspective";

  tiltCards.forEach((cardElem) => {
    let TILT_MAX_ANGLE = 5;
    let MOUSE_OUT_TRANSITION_DURATION = ".5s";
    let PERSPECTIVE_VALUE = 1000;
    let TILT_GRAVITY = _gravityOptions.negative; // negative or positive

    // Override the default values if the data attributes are present
    const user_input_angle = cardElem.getAttribute("data-ac-angle");
    const user_input_gravity = cardElem.getAttribute("data-ac-gravity");
    const user_input_perspective = cardElem.getAttribute("data-ac-perspective");

    // Validate the user input angle
    if (!isNaN(parseInt(user_input_angle))) {
      TILT_MAX_ANGLE = user_input_angle;
    }

    // Validate the user input gravity
    if (user_input_gravity === _gravityOptions.positive) {
      TILT_GRAVITY = user_input_gravity;
    }

    // Validate the user input perspective
    if (!isNaN(parseInt(user_input_perspective))) {
      PERSPECTIVE_VALUE = user_input_perspective;
    }

    // Create a parent div with perspective style
    const parentElem = document.createElement("div");
    parentElem.style.perspective = PERSPECTIVE_VALUE + "px";
    parentElem.classList.add(PARENT_CLASS_NAME);

    // Wrap the cardElem with the parentElem
    cardElem.parentNode.insertBefore(parentElem, cardElem);
    parentElem.appendChild(cardElem);

    let cardDimensions = { width: 0, height: 0 };

    const handleMouseEnter = (e) => {
      cardElem.style.transition = "none";
      cardDimensions.width = e.currentTarget.clientWidth;
      cardDimensions.height = e.currentTarget.clientHeight;
    };

    const handlePointerMove = (e) => {
      const { width, height } = cardDimensions;
      const cardHalfWidth = width / 2;
      const cardHalfHeight = height / 2;

      const rect = parentElem.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;

      const cardXPosition =
        TILT_GRAVITY === _gravityOptions.positive ? cardHalfWidth - offsetX : offsetX - cardHalfWidth;
      const cardYPosition =
        TILT_GRAVITY === _gravityOptions.positive ? cardHalfWidth - offsetY : offsetY - cardHalfWidth;

      const xTiltAngle = (TILT_MAX_ANGLE * cardXPosition) / cardHalfWidth;
      const yTiltAngle = (TILT_MAX_ANGLE * cardYPosition) / cardHalfHeight;

      cardElem.style.transform = `rotateY(${-xTiltAngle}deg) rotateX(${yTiltAngle}deg)`;
    };

    const handleMouseLeave = () => {
      cardElem.style.transition = `transform ${MOUSE_OUT_TRANSITION_DURATION} ease`;
      cardElem.style.transform = "rotateX(0deg) rotateY(0deg)";
    };

    parentElem.addEventListener("mouseenter", handleMouseEnter);
    parentElem.addEventListener("pointermove", handlePointerMove);
    parentElem.addEventListener("mouseleave", handleMouseLeave);
  });
});

module.exports = tiltEffect;
