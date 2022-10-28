interface ObjectLiteral {
  [key: string]: any;
}

module.exports = (paramsObject: ObjectLiteral) => {
  const keys = Object.keys(paramsObject);

  for (const key of keys)
    if (!paramsObject[key]) return { yes: true, whichOne: key };

  return { whichOne: -1, yes: false };
};
