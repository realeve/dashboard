export const getHeadLevel = (columns, level = 1) => {
  let curLevel = 1;
  columns.forEach((column) => {
    let tempLevel = level;
    if (column.children) {
      tempLevel += 1;
      tempLevel = getHeadLevel(column.children, tempLevel);
    }
    curLevel = Math.max(curLevel, tempLevel);
  });
  return Math.max(curLevel, level);
};
