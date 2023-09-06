import "../style/navbar.css"
import openInNewTab from "../helpers/misc"
function Navbar(){
    return (
        <div className="Navbar">
            <button className="navbt">MMRP</button>
            <button className="navbt" onClick={() => openInNewTab('/new')}>New</button>
            <button className="navbt">Database</button>

        </div>
    )
}

export default Navbar;