export const mergeArraysOfObjects = (arr1, arr2, key) => {
  const allItems = arr1.concat(arr2);

  const uniqueMap = new Map();
  allItems.forEach((item) => {
    uniqueMap.set(item[key], item);
  });

  return [...uniqueMap.values()];
};
