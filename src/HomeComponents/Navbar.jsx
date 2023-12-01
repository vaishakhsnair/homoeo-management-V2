import "../style/navbar.css"
import openInNewTab from "../helpers/misc"
function Navbar(){
    return (
        <div className="Navbar">
            <button className="navbt" onClick={() => openInNewTab('/mmrp')}>MMRP</button>
            <button className="navbt" onClick={() => openInNewTab('/new')}>New</button>
            <button className="navbt" onClick={() => openInNewTab('/database')}>Database</button>

        </div>
    )
}

export default Navbar;