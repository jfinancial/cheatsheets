export function convertToNumbers(arrayWithValues) {
  return arrayWithValues.flatMap(
    (value) => {
      const num = Number(value);
      if (Number.isNaN(num)) {
        return []; // exclude
      } else {
        return [num]; // include
      }
    }
  );
}
