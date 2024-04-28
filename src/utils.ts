import api from './services/api';

export const isNumeric = (number: string): boolean => {
  return /^-?\d+$/.test(number);
};

// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
export const shuffleArray = (array: any[]): any[] => {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];

    array[i] = array[j];
    array[j] = temp;
  }

  return array;
};

export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min)) + min;
};

const getAllProblems = async () => {
  try {
    const response = await api.get('/problemset.problems');

    if (response.data.status === 'FAILED') {
      throw new Error('An error has occurred');
    } else {
      return response.data.result.problems;
    }
  } catch {
    throw new Error('Codeforces API is currently unavailable');
  }
};

const getAcceptedProblemsByHandle = async (handle: string) => {
  try {
    const response = await api.get(`user.status?handle=${handle}`);

    if (response.data.status === 'FAILED') {
      throw new Error('An error has occurred');
    } else {
      return response.data.result.filter(
        (element: any) => element.verdict === 'OK',
      );
    }
  } catch {
    throw new Error('Codeforces API is currently unavailable');
  }
};

const getAllContests = async () => {
  try {
    const response = await api.get('/contest.list?gym=false');

    if (response.data.status === 'FAILED') {
      throw new Error('An error has occurred');
    } else {
      return response.data.result;
    }
  } catch {
    throw new Error('Codeforces API is currently unavailable');
  }
}

export const generateProblems = async (
  handles: string[],
  ratings: string[],
  div1: boolean,
  div2: boolean,
  div3: boolean,
  div4: boolean,
) => {
  let allProblems = await getAllProblems();
  let allContests = await getAllContests();

  let contestInfo: { [id: number]: boolean } = {};

  allContests.forEach((contest: any) => {
    if (
        (div4 && contest.name.includes("Div. 4")) ||
        (div3 && contest.name.includes("Div. 3")) ||
        (div2 && !div1 && contest.name.includes("Div. 2") && !contest.name.includes("Div. 1")) ||
        (!div2 && div1 && !contest.name.includes("Div. 2") && contest.name.includes("Div. 1")) ||
        (div2 && div1 && (contest.name.includes("Div. 2") || contest.name.includes("Div. 1")))
    ) {
      contestInfo[contest.id] = true;
    }
  });

  allProblems = allProblems.filter((problem: any) => contestInfo[problem.contestId] === true);

  await Promise.all(
    handles.map(async (handle) => {
      const acceptedProblems = await getAcceptedProblemsByHandle(handle);

      allProblems = allProblems.filter((problem: any) => {
        const problemId = `${problem.contestId}${problem.index}`;

        return !acceptedProblems.some(
          (acceptedProblem: any) =>
            `${acceptedProblem.problem.contestId}${acceptedProblem.problem.index}` ===
            problemId,
        );
      });

      Promise.resolve('ok');
    }),
  );

  type Problem = {
    rating: number;
    contestId: number;
    index: string;
  };

  const problemsByRating: { [rating: number]: Problem[] } = {};

  allProblems.forEach((problem: Problem) => {
    if (problem.rating) {
      if (problem.rating in problemsByRating) {
        problemsByRating[problem.rating].push(problem);
      } else {
        problemsByRating[problem.rating] = [problem];
      }
    }
  });

  const problems: Problem[] = [];

  ratings.forEach((rating: string) => {
    let randomProblem = problemsByRating[parseInt(rating)][getRandomInt(0, problemsByRating[parseInt(rating)].length)];
    let iterator = 0; // prevent infinite loop

    while (
      problems.some(
        (problem) =>
        `${problem.contestId}${problem.index}` === `${randomProblem.contestId}${randomProblem.index}`,
      ) && iterator < 100
    ) {
      randomProblem =
        problemsByRating[parseInt(rating)][
          getRandomInt(0, problemsByRating[parseInt(rating)].length)
        ];

      iterator++;
    }

    if (randomProblem) {
      problems.push(randomProblem);
    }
  });

  return problems.map(problem => {
    return {
      name: `${problem.contestId}${problem.index}`,
      rating: problem.rating,
      url: `https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`,
    }
  });
};
