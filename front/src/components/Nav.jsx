import { Link } from "react-router-dom"
import "../index.css"

const Nav = () => {
  return (
    <section>
      <div>
        <img src="gi" alt="logo Monks"/>
      </div>
      <div >
        <Link to="/home" className="bg-color-primary">Sair</Link>
      </div>
      
    </section>
  )
}

export default Nav