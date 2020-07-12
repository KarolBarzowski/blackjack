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
    const deckRect = deckRef.getBoundingClientRect();
    const handRect = handRef.getBoundingClientRect();

    const tl = gsap.timeline();

    tl.fromTo(
      element,
      {
        x: deckRect.right - handRect.right,
        y: deckRect.top - handRect.top,
        visibility: "visible",
      },
      {
        x: number > 0 ? 55 : 0,
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
