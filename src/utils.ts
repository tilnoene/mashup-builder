export const isNumeric = (number: string): boolean => {
  return /^-?\d+$/.test(number);
}

export const shuffleArray = (array: any[]): any[] => {
  // https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];

    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}

export const generateQuestions = (handles: string[], ratings: string[]) => {
  // TODO: iplementar função
  
  return [
    {
      name: '120A',
      rating: 1500,
      url: 'https://google.com',
    },
    {
      name: '120B',
      rating: 1600,
      url: 'https://google.com',
    },
    {
      name: '120C',
      rating: 1700,
      url: 'https://google.com',
    },
  ];
}