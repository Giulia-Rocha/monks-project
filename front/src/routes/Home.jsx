import{useForm} from "react-hook-form"
import { useNavigate } from "react-router-dom"
import axios from "axios";

const Home = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/login', data);
      const { username, role } = response.data;

      // Salva username e role no localStorage
      localStorage.setItem("username", username);
      localStorage.setItem("role", role);

      // Redireciona para a página de métricas
      navigate("/metrics");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Usuário ou senha incorretos");
      } else {
        alert("Erro ao conectar com a API");
      }
    }
  };

  return (
    <section>
      <h1 className="text-3xl bg-red-500 ">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Username:</label>
          <input {...register("username", { required: true })} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" {...register("password", { required: true })} />
        </div>
        <button type="submit">Entrar</button>
      </form>
    </section>
  );
};

export default Home;