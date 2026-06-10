export const calculateUnits = (message) => {
    if (!message) return 0;
    const length = message.length;
    if (length <= 160) return 1;
    return Math.ceil(length / 153);
  };