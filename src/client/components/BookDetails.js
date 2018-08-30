import React from 'react';

export default class BookDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = { book: [] };
  }

  componentDidMount() {
    fetch('/api/books/' + this.props.match.params.id)
      .then(res => res.json())
      .then(book => this.setState({ book: book }));
  }

  render() {
    console.log(this.state.book);
    var book = '';
    this.state.book.forEach(b => {
      book = b;
    });
    return (
      <div>
        <h3>{book.name}</h3>
        <img src={book.image} alt={book.name} className="img-thumbnail" />
        <p>{book.author}</p>
      </div>
    );
  }
}
