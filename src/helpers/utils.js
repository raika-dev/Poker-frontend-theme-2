export const convertX = (width1920, unit) => {
  return (unit * width1920) / 8;
};
export const convertY = (height1080, unit) => {
  return (unit * height1080) / 8;
};
export const convertXX = (width1920, unit) => {
  return convertX(width1920, unit) + (window.innerWidth - unit * 240) / 2;
};
export const convertYY = (height1080, unit) => {
  return convertY(height1080, unit) + (window.innerHeight - unit * 135) / 2;
};
export const helperPosition = (data, unit) => {
  let { x, y, w, h } = data;
  return {
    x: convertXX(x, unit),
    y: convertYY(y, unit),
    w: convertX(w, unit),
    h: convertY(h, unit),
  };
};
export const shortenName = (name) => {
  if (!name || !name.length) return "";
  return name.length < 10
    ? name.length
    : name.slice(0, 4) + "..." + name.slice(-3);
};
export const playerToPosition = (st, n) => {
  return (st + n) % 6;
};

export const positionOfPlayer = (st, n) => {
  return (st - n + 6) % 6;
};
export const saveRoomInfo = (address, tableId, position, buyIn) => {
  localStorage.setItem("roomInfo", { address, tableId, position, buyIn });
};

export const getRoomInfo = () => {
  return localStorage.getItem("roomInfo");
};

export const removeRoomInfo = () => {
  localStorage.removeItem("roomInfo");
};
export const generateArray = (count) => {
  let result = [];
  for (let i = 0; i < count; i++) {
    result.push(i);
  }
  return result;
};

const chipValues = [0.01, 0.05, 0.25, 1, 5, 10, 25, 100, 500, 1000, 5000];

export const getChipArray = (money) => {
  let chipList = [];
  let temp = money;
  for (let i = chipValues.length - 1; i >= 0; i--) {
    if (temp / chipValues[i] >= 1) {
      chipList.push({
        value: i,
        count: generateArray(Math.floor(temp / chipValues[i])),
      });
      temp = temp % chipValues[i];
    }
  }
  return chipList;
};
export const animation = (
  firstpoint,
  lastpoint,
  duration,
  currentTime,
  pw = 1,
  delay = 0
) => {
  const time = Math.max(currentTime - delay, 0);
  return duration > time
    ? firstpoint + ((lastpoint - firstpoint) / duration ** pw) * time ** pw
    : lastpoint;
};
