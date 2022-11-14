interface emptyKeyObj {
  yes: boolean;
  whichOne: string | number;
}

export const isThereAnyBodyParamUndefined = (paramsObject: object) => {
  const keys = Object.keys(paramsObject);
  const defaultObj = { whichOne: -1, yes: false } as emptyKeyObj;

  for (const key of keys) {
    if (!paramsObject[key]) {
      defaultObj.yes = true;
      defaultObj.whichOne = key;
      break;
    }
  }

  return defaultObj;
};
