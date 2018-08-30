import React, { Component } from 'react';
import './BooksTable.css';

const BookRow = props => {
  return (
    <tr>
      <td>{props.p.author}</td>
      <td>{props.p.name}</td>
      <td>...</td>
      <td>
        <img
          className="books-table-image"
          src={props.p.image}
          alt={props.p.name}
        />
      </td>
    </tr>
  );
};

class BooksTable extends React.Component {
  render() {
    const rows = [];
    if (!this.props.results.length) {
      return (
        <div>
          <p>No book!</p>
        </div>
      );
    }

    this.props.results.forEach(p => {
      rows.push(<BookRow p={p} key={p.name} />);
    });

    return (
      <table className="books-table table table-striped">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Author</th>
            <th scope="col">Name</th>
            <th scope="col">Category</th>
            <th scope="col">description</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

export default BooksTable;
