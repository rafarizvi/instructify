import Card from 'react-bootstrap/Card';

// Adding format for date and passing it through as a prop to be used with dashboard, view tutorial and comments
const DateFormat = ( { createdAt } ) => {
  return (
    <p>Posted: {new Date(parseInt(createdAt)).toLocaleString()}</p>
  )
}

export default DateFormat