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
      navigate("/dashboard");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Usuário ou senha incorretos");
      } else {
        alert("Erro ao conectar com a API");
      }
    }
  };

  return (
    <section className="w-full min-h-screen flex justify-center items-center">
      <div className=" bg-medium-gray w-1/3 h-96 p-3 rounded-xl flex flex-col justify-evenly items-center  ">
        <h1 className="text-2xl font-regular ">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className=" w-8/10 h-1/3 flex flex-col justify-between items-center">
          <div className="flex gap-5 ">
            <label>Usuário:</label>
            <input className="h-6 bg-secondary border-1 border-black" {...register("username", { required: true })} />
          </div>
          <div className="flex gap-7 ">
            <label>Senha:</label>
            <input className="h-6 bg-secondary border-1 border-black"type="password" {...register("password", { required: true })} />
          </div>
          <button className="bg-secondary w-20 h-8 self-center rounded-xl "type="submit">Entrar</button>
        </form>
      </div>
      
    </section>
  );
};

export default Home;