import React, { Component } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import '../../../node_modules/react-grid-layout/css/styles.css';
import '../../../node_modules/react-grid-layout/css/styles.css';
import BookGridView from './BookGridView';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class IndexGridView extends React.Component {
  static defaultProps = {
    compactType: null,
    useCSSTransforms: true,
    preventCollision: false,
    cols: {
      lg: 12,
      md: 10,
      sm: 6,
      xs: 4,
      xxs: 2
    },
    breakpoints: {
      lg: 1200,
      md: 996,
      sm: 768,
      xs: 480,
      xxs: 0
    },
    // prettier-ignore
    layouts: {
      lg: [
        { i: 'a', x: 0, y: 0, w: 10, h: 2, minW: 10, maxW: 10, minH: 2, maxH: 4 },
        { i: 'b', x: 0, y: 2, w: 5, h: 2, minW: 4, maxW: 10, minH: 2, maxH: 4 },
        { i: 'c', x: 5, y: 2, w: 5, h: 2, minW: 4, maxW: 10, minH: 2, maxH: 4 }
      ],
      md: [
        { i: 'a', x: 0, y: 0, w: 10, h: 2, minW: 10, maxW: 10, minH: 2, maxH: 4 },
        { i: 'b', x: 0, y: 2, w: 10, h: 2, minW: 10, maxW: 10, minH: 2, maxH: 4 },
        { i: 'c', x: 5, y: 2, w: 10, h: 2, minW: 10, maxW: 10, minH: 2, maxH: 4 }
      ],
      sm: [
        { i: 'a', x: 0, y: 0, w: 6, h: 2, minW: 6, maxW: 10, minH: 2, maxH: 4 },
        { i: 'b', x: 0, y: 2, w: 6, h: 2, minW: 6, maxW: 10, minH: 2, maxH: 4 },
        { i: 'c', x: 5, y: 2, w: 6, h: 2, minW: 6, maxW: 10, minH: 2, maxH: 4 }
      ],
      xs: [
        { i: 'a', x: 0, y: 0, w: 4, h: 2, minW: 4, maxW: 10, minH: 2, maxH: 2 },
        { i: 'b', x: 0, y: 2, w: 4, h: 2, minW: 4, maxW: 10, minH: 2, maxH: 4 },
        { i: 'c', x: 5, y: 2, w: 4, h: 2, minW: 4, maxW: 10, minH: 2, maxH: 4 }
      ],
      xxs: [
        { i: 'a', x: 0, y: 0, w: 2, h: 2, minW: 2, maxW: 10, minH: 2, maxH: 4 },
        { i: 'b', x: 0, y: 2, w: 2, h: 2, minW: 2, maxW: 10, minH: 2, maxH: 4 },
        { i: 'c', x: 5, y: 2, w: 2, h: 2, minW: 2, maxW: 10, minH: 2, maxH: 4 }
      ]
    }
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
        this.setState({
          recentlyAddedData: books.slice(0, 10)
        });
        this.setState({
          mostDownloadData: books.slice(20, 25)
        });
        this.setState({
          userSuggestionData: books.slice(30, 50)
        });
      });
  }

  render() {
    // layout is an array of objects, see the demo for more complete usage

    return (
      <ResponsiveReactGridLayout
        {...this.props}
        // WidthProvider option
        measureBeforeMount={false}>
        <div key="a">
          <BookGridView title="Recently Added" data={this.state.recentlyAddedData} />
        </div>
        <div key="b">
          <BookGridView title="Most Downloaded" data={this.state.mostDownloadData} />
        </div>
        <div key="c">
          <BookGridView title="Only for you" data={this.state.userSuggestionData} />
        </div>
      </ResponsiveReactGridLayout>
    );
  }
}

export default IndexGridView;
