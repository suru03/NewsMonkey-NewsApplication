import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component'

export class News extends Component {
  static defaultProps = {
    country: "in",
    // pageSize: 8,
    category: 'general'
  }

  PropTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
  }
  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  constructor(props) {
    super();
    this.state = {
      articles:[],
      loading: false,
      page: 1,
      totalResults: 0
    }
    // document.title = `${this.props.category} - NewsMonkey`;
  }
  async updateNews(pageNo) {
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=2e9a282dc20a4b3a9b2709962ce65331&page=1&page=${this.state.page}&pagesize=${this.props.pageSize}`
    this.setState({ loading: true })
    let data = await fetch(url);
    let parseData = await data.json()
    this.setState({
      articles: parseData.articles,
      totalResults: parseData.totalResults,
      loading: false,
    })
  }
  async componentDidMount() {
    this.updateNews()
  }

  handlePrevClick = async () => {
    this.setState({ page: this.state.page - 1 });
    this.updateNews();
  }

  handleNextClick = async () => {
    this.setState({ page: this.state.page + 1 })
    this.updateNews();
  }
  fetchMoreData = async () => {
    this.setState({page: this.state.page + 1})
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=2e9a282dc20a4b3a9b2709962ce65331&page=1&page=${this.state.page}&pagesize=${this.props.pageSize}`
    this.setState({ loading: true })
    let data = await fetch(url);
    let parseData = await data.json()
    this.setState({
      articles:this.state.articles.concat(parseData.articles),
      totalResults: parseData.totalResults,
      loading: false
    })
  };
  render() {
    return (
      <>
        <h1 className="text-center">NewsMonkey - Top Headlines</h1>
        {/* {this.state.loading && <Spinner />} */}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<Spinner />}
        >
          <div className="container">

          <div className="row">
            {this.state.articles.map((element) => {
              return <div className="col-md-4" key={element.url}>
                <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
              </div>
            })}
          </div>
          </div>
        </InfiniteScroll>
      </>
    )
  }
}

export default News