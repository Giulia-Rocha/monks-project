import {useEffect, useState} from 'react'
import axios from 'axios'

const Dashboard = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [limit, setLimit] = useState(10); 
  const [offset, setOffset] = useState(0); 


  const role = localStorage.getItem("role") || "user";

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://127.0.0.1:8000/metrics", {
        params: {
          start_date: startDate || undefined,
          end_date: endDate || undefined,
          sort_by: sortBy || undefined,
          order: order,
          role: role,
          limit: limit,
          offset: offset,
        },
      });
      setMetrics(response.data);

      
    } catch (error) {
      alert("Erro ao carregar métricas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [startDate, endDate, sortBy, order, offset,limit]);

  

  return (
      <section className="p-4">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

        {/* Filtros */}
        <div className="flex gap-4 mb-4">
          <div>
            <label>Início:</label>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              className="border p-1"
            />
          </div>
          <div>
            <label>Fim:</label>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-1"
            />
          </div>
          <div>
            <label>Ordenar por:</label>
            <input 
              type="text" 
              placeholder="coluna" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="border p-1"
            />
          </div>
          <div>
            <label>Ordem:</label>
            <select 
              value={order} 
              onChange={(e) => setOrder(e.target.value)}
              className="border p-1"
            >
              <option value="asc">Crescente</option>
              <option value="desc">Decrescente</option>
            </select>
          </div>
          <button 
            onClick={fetchMetrics} 
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Aplicar
          </button>
        </div>

        {/* Tabela */}
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <table className="table-auto w-full border">
            <thead>
              <tr>
                {metrics.length > 0 &&
                  Object.keys(metrics[0]).map((col) => (
                    <th key={col} className="border px-2 py-1">{col}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((row, i) => (
                <tr key={i}>
                  {Object.keys(row).map((col) => (
                    <td key={col} className="border px-2 py-1">{row[col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="flex justify-between items-center mt-4">
        <button 
          onClick={() => setOffset((prev) => Math.max(prev - limit, 0))}
          disabled={offset === 0}
          className="bg-gray-500 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        
        <span>Página {Math.floor(offset / limit) + 1}</span>

        <button 
          onClick={() => setOffset((prev) => prev + limit)}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Próxima
        </button>
      </div>

      </section>
    );
  
}

export default Dashboard