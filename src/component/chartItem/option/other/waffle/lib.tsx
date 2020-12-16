import gsap from 'gsap';
export const init = ({
  selector = '_waffle_box',
  duration = 0.2,
  eachtime: each = 0.07,
  axis = 'y',
}: {
  axis?: 'x' | 'y';
  selector: gsap.TweenTarget;
  duration: number;
  eachtime: number;
}) => {
  gsap.to(selector, duration, {
    scale: 1,
    stagger: {
      axis,
      each,
    },
  });
};
