import React from "react";

function Fighters({ fighters }) {
  // Divide la lista de luchadores en grupos de 3 elementos cada uno
  const groupedFighters = [];
  for (let i = 0; i < fighters.length; i += 3) {
    groupedFighters.push(fighters.slice(i, i + 3));
  }

  return (
    <div>
      {groupedFighters.map((group, index) => (
        <div className="table" key={index}>
          {group.map((fighter, innerIndex) => (
            <p className="text-center" key={innerIndex}>
              {fighter}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Fighters;
