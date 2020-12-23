import styles from './index.less';

export default ({ fill = '#69bffe', size = 200, lineWidth = 5, value = 12 }) => {
  let x = size / 2,
    r = x * 0.8;

  return (
    <svg xmlns="http://www.w3.org/200/svg" height={size} width={size}>
      <circle
        cx={x}
        cy={x}
        r={r}
        stroke-width={lineWidth}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        stroke-linecap="round"
      />
      <circle
        className={styles.demo}
        style={{ transformOrigin: `${x}px ${x}px` }}
        cx={x}
        cy={x}
        r={r}
        stroke-width={lineWidth}
        fill="none"
        stroke={fill}
        stroke-dasharray={`${(2 * Math.PI * r * value) / 100},10000`}
      />
    </svg>
  );
};
