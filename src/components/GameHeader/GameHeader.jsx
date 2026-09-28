import './GameHeader.css'

const GameHeader = (props) => {
  return (
    <header className="game-header">
      <h1>{props.title}</h1>
    </header>
  )
}

export default GameHeader
