
import './Informacion.css'

const Informacion = ({puntos, fallos}) => {
    const calcularAciertos = () => {
        return puntos+fallos>0?(puntos/(puntos+fallos)*100).toFixed(0):0
    }

    return (
        <div className="informacion">
            <p>Puntos: {puntos}</p>
            <p>Fallos: {fallos}</p>
            <p>Acierto: {calcularAciertos()}%</p>
        </div>
    )
}

export default Informacion
