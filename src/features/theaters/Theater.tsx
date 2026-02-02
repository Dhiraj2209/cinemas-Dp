import './theater.css'
import type { TheaterType } from '../../types'
import { useNavigate } from 'react-router-dom'

type Props = {
  theater: TheaterType
}

const Theater = ({ theater }: Props) => {
  const navigate = useNavigate();
  const theaterData = {
    theaterId: theater.id,
    theaterName: theater.name,
    theaterLocation: theater.location,
  }

  return (
    <div className='theater' onClick={() => navigate(`/theater/${theater.id}`, { state: theaterData })}>
      <div className="theater-content">
        <h2>{theater.name}</h2>
        <p><i className='fas fa-location-dot'></i> {theater.location}</p>
      </div>
      <i className='fas fa-arrow-right theater-arrow'></i>
    </div>
  )
}

export default Theater