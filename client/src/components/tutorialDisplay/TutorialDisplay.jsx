//using to render the text AS the user writes it, with



const TutorialDisplay = ({ title, content, author, category }) => {

  
  return (
    <div className="tutorial-display" >
      <br />
      <h2>{title}</h2>

      <h4>By {author.name}</h4>
      <div className="category badge text-bg-info">{category.name}</div>
      <br />
      <br />
      <br />
      <div style={{ 'fontSize': '8px', whiteSpace: 'pre-wrap' }} className="content" dangerouslySetInnerHTML={{ __html: content }}></div>
    </div>
  );
};

export default TutorialDisplay;
