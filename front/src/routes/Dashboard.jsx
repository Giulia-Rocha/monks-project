import { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  // O estado 'metrics' agora armazena apenas o array de dados
  const [metrics, setMetrics] = useState([]);
  const [pagination, setPagination] = useState({ has_more: false, total: 0 });
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  // Pega o 'role' do localStorage para enviar à API
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
      
      
      // Atribui o array de dados a 'metrics' e o objeto de paginação a 'pagination'
      if (response.data && Array.isArray(response.data.data)) {
        setMetrics(response.data.data);
        setPagination(response.data.pagination);
      } else {
        // Reseta para um estado vazio caso a resposta não venha como esperado
        setMetrics([]);
        setPagination({ has_more: false, total: 0 });
      }

    } catch (error) {
      console.error("Erro ao carregar métricas:", error);
      alert("Erro ao carregar métricas. Verifique o console para mais detalhes.");
      setMetrics([]); // Limpa os dados em caso de erro
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchMetrics();
  }, [startDate, endDate, sortBy, order, offset, limit]);

  return (
    <section className="min-w-full min-h-screen p-4 flex flex-col gap-10">
      <h1 className="text-3xl font-regular text-shadow-lg/30 font-montserrat mb-4 self-center ">Dashboard de Métricas</h1>

      {/* Filtros */}
      <div className="flex flex-wrap justify-around items-center gap-4 mb-4">
        <div className='flex gap-2 items-center'>
          <label>Início:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border h-8 p-1 rounded"
          />
        </div>
        <div className='flex gap-2 items-center'>
          <label>Fim:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border h-8 p-1 rounded"
          />
        </div>
        <div className='flex gap-2 items-center'>
          <label>Ordenar por:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className='border h-8 p-1 rounded'
          >
            <option value="">Nenhum</option>
            <option value="date">Data</option>
            <option value="clicks">Clicks</option>
            <option value="impressions">Impressions</option>
            {role === 'admin' && <option value="cost_micros">Custo</option>}
          </select>
        </div>
        <div className='flex gap-2 items-center'>
          <label>Ordem:</label>
          <select
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="border h-8 p-1 rounded"
          >
            <option value="asc">Crescente</option>
            <option value="desc">Decrescente</option>
          </select>
        </div>
      </div>

      {/* Tabela de Dados */}
      {loading ? (
        <p className="text-center">Carregando...</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border">
              <thead className="bg-gray-100">
                <tr>
                  {/* Renderiza os cabeçalhos dinamicamente a partir das chaves do primeiro objeto */}
                  {metrics.length > 0 &&
                    Object.keys(metrics[0]).map((col) => (
                      <th key={col} className="border px-4 py-2 text-left uppercase">{col.replace('_', ' ')}</th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {metrics.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    {Object.values(row).map((cell, cellIndex) => (
                      <td key={`${rowIndex}-${cellIndex}`} className="border px-4 py-2">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {metrics.length === 0 && !loading && (
            <p className="text-center mt-4">Nenhum dado encontrado para os filtros selecionados.</p>
          )}

          {/* Controles de Paginação */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setOffset((prev) => Math.max(prev - limit, 0))}
              disabled={offset === 0 || loading}
              className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            
            <span>Exibindo {metrics.length} de {pagination.total} resultados</span>

            <button
              onClick={() => setOffset((prev) => prev + limit)}
              // MELHORIA: O botão "Próxima" agora é desabilitado com base na resposta da API
              disabled={!pagination.has_more || loading}
              className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próxima
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default Dashboard;
