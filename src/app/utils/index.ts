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

export const areAllExpectedParamsUndefined = (paramsObject: object) => {
  const result = { yes: false, message: "" };

  if (Object.values(paramsObject).every((val) => val === undefined)) {
    result.yes = true;
    result.message = `Missing at least one argument: ${Object.keys(
      paramsObject
    ).join(", ")}`;
  }

  return result;
};

export const isFilledArray = (val: any) => Array.isArray(val) && !!val.length;
