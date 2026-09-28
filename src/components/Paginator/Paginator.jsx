import './Paginator.css'

/**
 * Paginador de "Anterior / Siguiente" con el número de página.
 *
 * No se renderiza cuando solo cabe una página, para no ocupar sitio sin sentido.
 *
 * @param page       página actual, empezando en 0
 * @param totalPages total de páginas (mínimo 1)
 * @param onChange   recibe la página siguiente al pulsar un botón
 * @param disabled   bloquea los botones mientras se carga la página
 * @param label      etiqueta accesible de la navegación
 */
const Paginator = ({ page, totalPages, onChange, disabled = false, label = 'Paginación' }) => {
  if (totalPages <= 1) return null

  return (
    <nav className="paginator" aria-label={label}>
      <button
        className="paginator-button"
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={disabled || page <= 0}
      >
        ‹ 
      </button>
      <span className="paginator-status" aria-live="polite">
        Página {page + 1} de {totalPages}
      </span>
      <button
        className="paginator-button"
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={disabled || page >= totalPages - 1}
      >
         ›
      </button>
    </nav>
  )
}

export default Paginator
