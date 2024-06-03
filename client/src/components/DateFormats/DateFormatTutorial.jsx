const DateFormatTutorial = ({ createdAt }) => {
  return (
    <small className="text-center">{new Date(parseInt(createdAt)).toLocaleDateString('en-US', 
    { year: 'numeric', month: 'long', day: 'numeric' })}</small>
  )
}

export default  DateFormatTutorial 