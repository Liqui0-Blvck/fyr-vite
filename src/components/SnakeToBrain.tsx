import React from "react";
import { motion } from "framer-motion";

const SnakeToBrain: React.FC = () => {
  const snakes = Array.from({ length: 30 }, (_, i) => ({
    key: i,
    color: `hsl(${i * 36}, 70%, 50%)`, // Colores dinámicos
    startX: Math.random() * 900 - 250, // Posición inicial X aleatoria
    startY: Math.random() * 570 - 250, // Posición inicial Y aleatoria
  }));

  const finalPaths = [
    "M250,250 Q300,300 350,250", // Línea 1
    "M250,250 Q280,270 310,250", // Línea 2
    "M250,250 Q260,290 270,250", // Línea 3
    "M250,250 Q240,300 230,250", // Línea 4
    "M250,250 Q220,270 200,250", // Línea 5
    "M250,250 Q300,200 250,150", // Línea 6
    "M250,250 Q200,200 250,150", // Línea 7
    "M250,250 Q300,250 250,250", // Línea 8
    "M250,250 Q300,300 350,250", // Línea 9
    "M250,250 Q200,300 150,250", // Línea 10
  ];

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <svg
        width="500"
        height="500"
        viewBox="0 0 500 500"
        xmlns="http://www.w3.org/2000/svg"
      >
        {snakes.map(({ key, color, startX, startY }, index) => (
          <motion.path
            key={key}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round" // Extremos redondeados
            initial={{
              d: `M${startX + 250},${startY + 250} Q250,250 250,250`,
            }}
            animate={{
              d: finalPaths[index % finalPaths.length], // Forma final
              opacity: [1, 0], // Desvanecer al finalizar
            }}
            transition={{
              duration: 3,
              delay: key * 0.2, // Retraso escalonado para cada serpiente
              ease: "easeInOut",
              repeat: Infinity, // Repetir infinito
              repeatType: "loop", // Ciclo continuo
            }}
          />
        ))}
      </svg>
    </div>
  );
};

export default SnakeToBrain;
