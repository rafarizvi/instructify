const TutorialDisplay = ({ title, content, author, category }) => {
  if (!author || !category) {
    return <div>Loading...</div>;
  }

  return (
    <div className="tutorial-display">
      <br />
      <h2>{title}</h2>
      <h4>By {author.name}</h4>
      <div className="category badge text-bg-info">{category.name}</div>
      <br />
      <br />
      <br />
      <div style={{ fontSize: '16px', whiteSpace: 'pre-wrap' }} className="content" dangerouslySetInnerHTML={{ __html: content }}></div>
    </div>
  );
};

export default TutorialDisplay;
