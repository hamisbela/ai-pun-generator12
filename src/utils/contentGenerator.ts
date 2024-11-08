const generateWithAI = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate content');
    }

    const data = await response.json();
    
    if (!data.result?.response) {
      throw new Error('Invalid API response format');
    }

    return data.result.response;
  } catch (error) {
    console.error('Error generating content:', error);
    throw new Error('Unable to generate content. Please try again later.');
  }
};

const generatePrompt = (topic: string, type: string): string => {
  const prompts = {
    puns: `Generate 5 clever puns about "${topic}".
Requirements:
- Each pun should be witty and original
- Include wordplay that relates to the topic
- Keep them family-friendly
- Make them memorable and shareable

Return only the 5 puns, one per line, without numbers or additional text.`,

    jokes: `Generate 5 original jokes about "${topic}".
Requirements:
- Each joke should be clever and witty
- Include setup and punchline
- Keep them family-friendly
- Make them engaging and memorable

Return only the 5 jokes, one per line, without numbers or additional text.`,

    wordplay: `Generate 5 creative wordplay examples about "${topic}".
Requirements:
- Use clever linguistic techniques
- Include double meanings or homophones
- Keep them family-friendly
- Make them intellectually engaging

Return only the 5 wordplay examples, one per line, without numbers or additional text.`,

    riddles: `Generate 5 clever riddles about "${topic}".
Requirements:
- Each riddle should be challenging but solvable
- Include wordplay and clever misdirection
- Keep them family-friendly
- Make them thought-provoking

Return only the 5 riddles, one per line, without numbers or additional text.`,

    epigrams: `Generate 5 witty epigrams about "${topic}".
Requirements:
- Each epigram should be concise and memorable
- Include clever observations or paradoxes
- Keep them family-friendly
- Make them thought-provoking

Return only the 5 epigrams, one per line, without numbers or additional text.`
  };

  return prompts[type as keyof typeof prompts] || prompts.puns;
};

export const generateContent = async (
  topic: string,
  type: string = 'puns'
): Promise<string[]> => {
  try {
    const prompt = generatePrompt(topic, type);
    const result = await generateWithAI(prompt);
    
    // Split the result into lines and clean up
    const lines = result.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .slice(0, 5);

    // If we got no valid lines, throw an error
    if (lines.length === 0) {
      throw new Error('No valid content generated');
    }

    return lines;
  } catch (error) {
    console.error('Error in generateContent:', error);
    throw error instanceof Error ? error : new Error('Failed to generate content. Please try again.');
  }
};