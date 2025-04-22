/**
 * Calculates response time in seconds from question start to answer
 * @param {string} startTime - ISO timestamp when question started
 * @param {string} endTime - ISO timestamp when question was answered
 * @returns {number} Response time in seconds
 */
export const calculateResponseTime = (startTime, endTime) => {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  return ((end - start) / 1000).toFixed(1);
};

/**
 * Processes game results data for question performance visualization
 * @param {Array} results - Array of player results with answers
 * @returns {Object} Object containing labels and correct/incorrect data arrays
 */
export const processQuestionPerformanceData = (results) => {
  if (!results || !results.length) {
    return { questionLabels: [], correctCount: [], incorrectCount: [] };
  }

  // Find player with most answers to determine total questions
  const maxAnswersPlayer = [...results].sort(
    (a, b) => (b.answers?.length || 0) - (a.answers?.length || 0)
  )[0];

  const totalQuestions = maxAnswersPlayer?.answers?.length || 0;

  // Initialize data structures
  const questionLabels = [];
  const correctCount = [];
  const incorrectCount = [];

  // Process each question's performance data
  for (let i = 0; i < totalQuestions; i++) {
    questionLabels.push(`Q${i + 1}`);

    let correct = 0;
    let incorrect = 0;

    // Count correct/incorrect answers for this question across all players
    results.forEach((player) => {
      if (player.answers && player.answers[i]) {
        if (player.answers[i].correct) {
          correct++;
        } else {
          incorrect++;
        }
      }
    });

    correctCount.push(correct);
    incorrectCount.push(incorrect);
  }

  return { questionLabels, correctCount, incorrectCount };
};

/**
 * Processes game results data for response time visualization
 * @param {Array} results - Array of player results with answers
 * @returns {Object} Object containing labels and average response times
 */
export const processResponseTimeData = (results) => {
  if (!results || !results.length) {
    return { questionLabels: [], averageResponseTimes: [] };
  }

  // Find player with most answers to determine total questions
  const maxAnswersPlayer = [...results].sort(
    (a, b) => (b.answers?.length || 0) - (a.answers?.length || 0)
  )[0];

  const totalQuestions = maxAnswersPlayer?.answers?.length || 0;

  // Initialize data structures
  const questionLabels = [];
  const averageResponseTimes = [];

  // Process each question's response time data
  for (let i = 0; i < totalQuestions; i++) {
    questionLabels.push(`Q${i + 1}`);

    let totalTime = 0;
    let responseCount = 0;

    // Calculate average response time for this question
    results.forEach((player) => {
      if (
        player.answers &&
        player.answers[i] &&
        player.answers[i].questionStartedAt &&
        player.answers[i].answeredAt
      ) {
        const responseTime = calculateResponseTime(
          player.answers[i].questionStartedAt,
          player.answers[i].answeredAt
        );

        if (!isNaN(responseTime)) {
          totalTime += parseFloat(responseTime);
          responseCount++;
        }
      }
    });

    // Add average or 0 if no valid responses
    averageResponseTimes.push(
      responseCount > 0 ? (totalTime / responseCount).toFixed(1) : 0
    );
  }

  return { questionLabels, averageResponseTimes };
};

/**
 * Processes game results data for bar chart visualization
 * @param {Array} results - Array of player results with scores
 * @returns {Object} Object containing processed data for the bar chart
 */
export const processResultsForBarChart = (results) => {
  if (!results || !results.length) {
    return {
      dataset: [],
      xAxis: [],
      series: [],
    };
  }

  // Sort players by score in descending order
  const sortedResults = [...results].sort(
    (a, b) => (b.score || 0) - (a.score || 0)
  );

  // Take top 10 players for better visualization
  const topPlayers = sortedResults.slice(0, 10);

  // Create dataset for chart
  const dataset = topPlayers.map((player) => ({
    player: player.name || 'Anonymous',
    score: player.score || 0,
  }));

  // Extract player names for x-axis
  const xAxis = dataset.map((item) => item.player);

  // Create series configuration
  const series = [
    {
      dataKey: 'score',
      label: 'Score',
      valueFormatter: (value) => `${value} points`,
    },
  ];

  return { dataset, xAxis, series };
};
