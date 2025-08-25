import { Link, useNavigate } from "react-router-dom"
import "../index.css"

const Nav = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <section className="w-full min-h-16 flex justify-around items-center bg-primary text-secondary ">
      <div>
        <img src="gi" alt="logo Monks"/>
      </div>
      <div className=" ">
        <button onClick={handleLogout} className="self-center">Sair</button>
      </div>
      
    </section>
  )
}

export default Nav