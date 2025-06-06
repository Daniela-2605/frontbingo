import { useState } from 'react';
import axios from 'axios';

function Keno() {
  const [numeros, setNumeros] = useState([]);

  const generar = async () => {
    const res = await axios.get('http://localhost:3001/api/bingo/keno');
    setNumeros(res.data.keno);
  };

  return (
    <div>
      <h2>Keno</h2>
      <button onClick={generar}>Generar</button>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {numeros.map((n, i) => <div key={i} style={{ padding: '10px', border: '1px solid black' }}>{n}</div>)}
      </div>
    </div>
  );
}

export default Keno;
