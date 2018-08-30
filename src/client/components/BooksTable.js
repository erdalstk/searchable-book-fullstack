import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './BooksTable.css';

const BookRow = props => {
  return (
    <tr>
      <td>
        <Link to={'/books/' +  props.p.id}>{props.p.name}</Link>
        {/* <a href="#">{props.p.name}</a> */}
      </td>
      <td>{props.p.author}</td>
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
      rows.push(<BookRow p={p} key={p.id} />);
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
