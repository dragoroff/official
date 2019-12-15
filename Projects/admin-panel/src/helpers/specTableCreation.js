export const specTableCreation = (arrayRows, stateData, compData) => {
  let arrayNumbers = [];
  let paid = stateData[0].paid;
  let open = stateData[0].open;
  let sum = paid + open;
  arrayNumbers.push(sum, paid, open);
  for (let i in arrayRows) {
    compData.push({ text: arrayRows[i] });
  }
  for (let j in arrayNumbers) {
    compData[j].number = arrayNumbers[j];
  }
};
