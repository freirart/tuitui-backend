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

/**
 * Substituirá as funções 'areAllExpectedParamsUndefined' e 'isThereAnyBodyParamUndefined'
 * Mesclando-as numa mesmo, por terem praticamente o mesmo comportamento.
 */

type EmptyKeyObj = {
  whichOne: string;
  yes: boolean;
};

type ParamsObject = {
  [key: string]: any; // or replace `any` with a more specific type
};

export const validateParams = (paramsObject: ParamsObject) => {
  const emptyKeyObj: EmptyKeyObj = { whichOne: "", yes: false };
  const allUndefined = Object.values(paramsObject).every((val) => val === undefined);

  for (const key in paramsObject) {
    if (!paramsObject[key]) {
      emptyKeyObj.yes = true;
      emptyKeyObj.whichOne = key;
      break;
    }
  }

  if (allUndefined) {
    return {
      yes: true,
      message: `Missing all arguments: ${Object.keys(paramsObject).join(", ")}`,
    };
  }

  if (emptyKeyObj.yes) {
    return {
      yes: true,
      message: `Missing argument: ${emptyKeyObj.whichOne}`,
    };
  }

  return { yes: false, message: "" };
};

export const isFilledArray = (val: any) => Array.isArray(val) && !!val.length;

export const isObjectWithProps = (val: any) =>
  val && typeof val === "object" && Object.keys(val).length;
