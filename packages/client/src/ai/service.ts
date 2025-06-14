const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:3001';

export const predict = async (char: string) => {
  if (char.length !== 1) {
    throw new Error(`Invalid input: ${char}`);
  }

  try {
    const response = await fetch(`${AI_SERVICE_URL}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ character: char }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error('Invalid response from AI service');
    }

    // The server already returns the correct format, no need to transpose
    return data.data;

  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('AI service is unavailable. Please ensure the server is running.');
    }
    throw error;
  }
};
