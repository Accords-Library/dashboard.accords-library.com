export const uniqueBy = <T, K extends string | number>(array: T[], getKey: (item: T) => K) => {
  const alreadyFoundKeys: K[] = [];
  return array.filter((item) => {
    var currentItemKey = getKey(item);
    if (alreadyFoundKeys.includes(currentItemKey)) return false;
    alreadyFoundKeys.push(currentItemKey);
    return true;
  });
};
