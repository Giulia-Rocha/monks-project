import { Link } from "react-router-dom"
import "../index.css"

const Nav = () => {
  return (
    <section className="w-full min-h-16 flex justify-around items-center bg-primary text-secondary ">
      <div>
        <img src="gi" alt="logo Monks"/>
      </div>
      <div className=" ">
        <Link to="/" className="self-center">Sair</Link>
      </div>
      
    </section>
  )
}

export default Nav