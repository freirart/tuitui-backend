export const getMissingArgumentMessage = (arg: string) => {
  return `Missing argument: ${arg}`;
};

export const validateParams = (paramsObject: object) => {
  const validationObj = { message: "", valid: true };
  const allUndefined = Object.values(paramsObject).every((val) => val === undefined);

  if (allUndefined) {
    validationObj.valid = false;
    validationObj.message = `Missing all arguments: ${Object.keys(paramsObject).join(", ")}`;
  } else {
    for (const key in paramsObject) {
      if (!paramsObject[key]) {
        validationObj.valid = false;
        validationObj.message = getMissingArgumentMessage(key);
        break;
      }
    }
  }

  return validationObj;
};

export const isFilledArray = (val: any) => Array.isArray(val) && !!val.length;

export const isObjectWithProps = (val: any) =>
  val && typeof val === "object" && Object.keys(val).length;
