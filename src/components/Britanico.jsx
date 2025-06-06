import { useState } from 'react';
import axios from 'axios';

function Britanico() {
  const [carton, setCarton] = useState([]);

  const generar = async () => {
    const res = await axios.get('http://localhost:3001/api/bingo/britanico');
    setCarton(res.data);
  };

  return (
    <div>
      <h2>Británico</h2>
      <button onClick={generar}>Generar</button>
      <table border="1">
        <tbody>
          {carton.map((fila, i) => (
            <tr key={i}>
              {fila.map((num, j) => <td key={j}>{num || ''}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Britanico;
