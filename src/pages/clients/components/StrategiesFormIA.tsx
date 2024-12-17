import React, { useState } from 'react';
import generateInvestmentStrategy from '../../../utils/openAI';

const StrategyFormIA = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (input.trim() === '') return;
    setLoading(true);

    const prompt = `Genera una estrategia de inversión para un perfil ${input}`;
    
    try {
      const strategy = await generateInvestmentStrategy(prompt);
      setResponse(strategy);  // Muestra la respuesta de la IA
    } catch (error) {
      setResponse("Ocurrió un error al generar la estrategia");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="strategy-form">
      <h1>Generador de Estrategias de Inversión</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ej. Inversión conservadora, agresiva, moderada"
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Generando..." : "Generar Estrategia"}
      </button>

      {response && <div className="response">{response}</div>}
    </div>
  );
};

export default StrategyFormIA;
