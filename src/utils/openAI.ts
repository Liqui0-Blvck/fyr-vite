const generateInvestmentStrategy = async (prompt: string) => {
  const API_KEY = process.env.VITE_OPEN_ID_KEY  // Asegúrate de reemplazar esto con tu clave API de OpenAI

  console.log(API_KEY)

  try {
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo-0125',  // Puedes usar otro modelo como gpt-3.5-turbo si es necesario
        prompt: prompt,
        max_tokens: 300,  // Puedes ajustar el número de tokens según tu necesidad
        temperature: 0.7,  // Controla la creatividad de la respuesta
      })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log(data)
    return data.choices[0].text.trim();
  } catch (error) {
    console.error("Error generating strategy:", error);
    return "Error generating the strategy. Please try again.";
  }
};

export default generateInvestmentStrategy;
