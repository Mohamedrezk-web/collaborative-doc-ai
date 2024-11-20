function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const color = [0, 0, 0]
    .map((_, i) => {
      const value = (hash >> (i * 8)) & 0xff;
      return value.toString(16).padStart(2, '0');
    })
    .join('');

  return `#${color}`;
}

export default stringToColor;
