import React, { Component } from 'react';
import './App.css';
import moment from 'moment';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: []
    }
  }

  componentDidMount() {
    let request = new Request('http://shakespeare.podium.co/api/reviews');
    request.headers.append('Authorization', 'koOheljmQX');
    fetch(request)
    .then((response) => {
      response.json().then(resp => {
        this.setState({
          reviews: resp.data,
          avgRating: this.getAverageRating(resp.data)
        });
      });
    })
    .catch((e) => {
      
    });
  }

  getAverageRating(data) {
    let ratingSum = data.reduce((acc, val) => {
      return acc + val.rating
    }, 0);
    return (ratingSum / data.length).toFixed(2);
  }

  fetchFullReview(id, callback) {
    let request = new Request('http://shakespeare.podium.co/api/reviews/' + id);
    request.headers.append('Authorization', 'koOheljmQX');
    console.log('fetch full review');
    fetch(request)
    .then((response) => {
      console.log('then');
      response.json().then(resp => {
        callback(resp, id);
      })
    })
    .catch((e) => {
      console.log('error', e);
    });
  }

  _processFullReview(response, id) {
    let review = this.state.reviews.find((val, idx, vals) => {
      return val.id === id
    });
    review.reviewBody = response.data.body;
    this.forceUpdate();
  }

  render() {
    // I generate the rows at this level and pass them
    // to the table to avoid replicating props multiple levels deep
    // It also helps keep ReviewsTable more generic and reusable
    let {reviews, avgRating} = this.state;
    let rows = reviews.map((review, idx, reviews) => { 
      return <ReviewBasic onReviewClick={(review) => {this.fetchFullReview(review.id, this._processFullReview.bind(this))}} key={review.id} review={review} />
    });
    return (
      <div className="App">
        <h1 className="pageTitle">To see or not to see...</h1>
        <h3 className="playwright">Playwright: William Shakespeare</h3>
        <div>
          <StarRating widthPercent={(avgRating / 5 * 100) + '%'} />
          <span className="totalReviews">{reviews.length + ' reviews'}</span>
        </div>
        <div className="reviewsContainer" >
          <ReviewsList>
            {rows}
          </ReviewsList> 
        </div>
      </div>
    );
  }
}

const ReviewsList = (props) => {
  return(
    <div className="ReviewsList">
      {props.children}
    </div>
  );
}

const ReviewBasic = (props) => {
  let {review} = props;
  let widthPercent = (review.rating / 5 * 100) + '%';
  return (
    <div className="ReviewBasic">
      <h4 className="ReviewBasic-author">{review.author}</h4>
      <StarRating widthPercent={widthPercent}/>
      <span className="ReviewBasic-date">{moment(review.publish_date).fromNow()}</span>
      <div className="ReviewBasic-body">
        {review.reviewBody ? 
          <p>{review.reviewBody}</p>
          :
          <a onClick={() => { props.onReviewClick(review) }} className="ReviewBasic-link">Read Review</a>}
      </div>
    </div>
  );
}

const StarRating = (props) => {
  let {widthPercent} = props;
  return (
    <div className="StarRating">
      <div className="StarRating-css-top" style={{"width": widthPercent}} title={widthPercent}><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
      <div className="StarRating-css-bottom"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
    </div>
  )
}

export default App;

export {
  StarRating,
  ReviewBasic,
  ReviewsList
}
