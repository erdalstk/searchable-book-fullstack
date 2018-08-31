import React, { Component } from 'react';
import ResponsiveGridLayout from 'react-grid-layout';
import '../../../node_modules/react-grid-layout/css/styles.css';
import '../../../node_modules/react-grid-layout/css/styles.css';
import BookGridView from './BookGridView';

class IndexGridView extends React.Component {
  static defaultProps = {
    compactType: null,
    useCSSTransforms: true,
    preventCollision: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      recentlyAddedData: [],
      mostDownloadData: [],
      userSuggestionData: []
    };
  }

  componentDidMount() {
    fetch('/api/books')
      .then(res => res.json())
      .then(books => {
        this.setState({ recentlyAddedData: books.books.slice(0, 5) });
        this.setState({ mostDownloadData: books.books.slice(20, 23) });
        this.setState({ userSuggestionData: books.books.slice(30, 33) });
      });
  }

  render() {
    // layout is an array of objects, see the demo for more complete usage
    var layout = [
      { i: 'a', x: 0, y: 0, w: 10, h: 7, maxH: 14, minH: 7, minW: 10 },
      { i: 'b', x: 0, y: 7, w: 6, h: 7, minW: 5, maxW: 10, maxH: 14, minH: 7 },
      { i: 'c', x: 6, y: 7, w: 6, h: 7, minW: 5, maxH: 14, minH: 7 }
    ];
    return (
      <ResponsiveGridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={30}
        width={1200}
        {...this.props}
      >
        <div key="a">
          <BookGridView
            title="Recently Added"
            data={this.state.recentlyAddedData}
          />
        </div>
        <div key="b">
          <BookGridView
            title="Most Downloaded"
            data={this.state.mostDownloadData}
          />
        </div>
        <div key="c">
          <BookGridView
            title="Only for you"
            data={this.state.userSuggestionData}
          />
        </div>
      </ResponsiveGridLayout>
    );
  }
}

export default IndexGridView;
