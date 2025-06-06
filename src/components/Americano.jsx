import { useState } from 'react';
import axios from 'axios';

function Americano() {
  const [carton, setCarton] = useState(null);

  const generar = async () => {
    const res = await axios.get('http://localhost:3001/api/bingo/americano');
    setCarton(res.data);
  };

  return (
    <div>
      <h2>Americano</h2>
      <button onClick={generar}>Generar</button>
      {carton && (
        <table border="1">
          <thead>
            <tr>{Object.keys(carton).map(k => <th key={k}>{k}</th>)}</tr>
          </thead>
          <tbody>
            {[0,1,2,3,4].map(i => (
              <tr key={i}>
                {Object.keys(carton).map(k => <td key={k+i}>{carton[k][i]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Americano;
