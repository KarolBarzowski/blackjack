import { keyframes } from "styled-components";
import { gsap } from "gsap";

export const SlideIn = keyframes`
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(0);
  }
`;

export const SlideInLeft = keyframes`
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(0);
  }
`;

export const Disappear = keyframes`
  from {
    transform: translateY(3.5rem);
  }

  to {
    transform: translateY(0);
  }
`;

export const animateDeal = (
  destination,
  number,
  deckRef,
  handRef,
  handleFlipCard,
  setIsAnimating
) => {
  gsap.defaults({ ease: "power3.inOut" });

  const dealCard = (element) => {
    let deckRect = { right: 0, top: 0 };
    if (deckRef) {
      deckRect = deckRef.getBoundingClientRect();
    }

    let handRect = { right: 0, top: 0 };
    if (handRef) {
      handRect = handRef.getBoundingClientRect();
    }

    const tl = gsap.timeline();

    tl.fromTo(
      element,
      {
        x: deckRect.right - handRect.right,
        y: deckRect.top - handRect.top,
        visibility: "visible",
      },
      {
        x: 55 * number,
        y: 0,
        rotate: Math.random() < 0.5 ? 3 : -3,
        duration: 1.25,
      },
      0
    ).call(() => handleFlipCard(destination, number), null, 0.5);

    return tl;
  };

  gsap
    .timeline()
    .add(dealCard(handRef.children[number]))
    .call(() => {
      setIsAnimating(false);
    });
};

export const slideInUp = (element) => {
  const tl = gsap.timeline();

  tl.fromTo(
    element,
    {
      autoAlpha: 0,
      y: 200,
    },
    { y: 0, autoAlpha: 1 }
  );

  return tl;
};

export const slideInRight = (element) => {
  const tl = gsap.timeline();

  tl.fromTo(
    element,
    {
      x: "-=200px",
    },
    {
      x: 0,
    }
  );

  return tl;
};

export const slideOutDown = (element) => {
  const tl = gsap.timeline();

  tl.fromTo(
    element,
    {
      autoAlpha: 1,
      y: 0,
    },
    { y: 200, autoAlpha: 0 }
  );

  return tl;
};

export const slideOutLeft = (element) => {
  const tl = gsap.timeline();

  tl.fromTo(
    element,
    {
      x: 0,
    },
    {
      x: "-=200px",
    }
  );

  return tl;
};
