import gsap from 'gsap';
export const init = ({ selector = '_waffle_box', duration = 0.2, eachtime = 0.07 }) => {
  gsap.to(selector, duration, {
    scale: 1,
    stagger: {
      grid: 'auto',
      from: 'start',
      axis: 'y',
      each: eachtime,
    },
  });
};
