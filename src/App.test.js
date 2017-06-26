import React from 'react';
import ReactDOM from 'react-dom';
import {shallow} from 'enzyme';
import App from './App';

import {
  StarRating,
  ReviewsList,
  ReviewBasic
} from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

it('renders a reviews list', () => {
  let reviewsList = shallow(<ReviewsList />);
  expect(reviewsList.find('.ReviewsList').length).toEqual(1);
});

it('renders a star rating', () => {
  let starRating = shallow(<StarRating widthPercent='80%' />);
  expect(starRating.find('.StarRating').length).toEqual(1);
  expect(starRating.instance().props.widthPercent).toEqual('80%');
});

it('renders a basic review', () => {
  const mockCallback = jest.fn();
  let review = {
    author: "Kaley Schiller",
    id: "9783221620868",
    publish_date: "2016-09-05T23:25:47.642350Z",
    rating: 0.8
  };
  let reviewBasic = shallow(<ReviewBasic onReviewClick={mockCallback} key={1} review={review} />);
  expect(reviewBasic.find('.ReviewBasic').length).toEqual(1);
  reviewBasic.instance().props.onReviewClick();
  expect(mockCallback.mock.calls.length).toBe(1);
});

it('should render a link or review body correctly', () => {
  let review = {
    author: "Kaley Schiller",
    id: "9783221620868",
    publish_date: "2016-09-05T23:25:47.642350Z",
    rating: 0.8
  };
  let reviewBasic = shallow(<ReviewBasic onReviewClick={() => {}} key={1} review={review} />);
  expect(reviewBasic.find('a').length).toEqual(1);
  review.reviewBody = 'test';
  reviewBasic.setProps({
    review: review
  });
  expect(reviewBasic.find('a').length).toEqual(0);
  expect(reviewBasic.find('.ReviewBasic-body p').length).toEqual(1);
});

it('should calculate average rating', () => {
  let app = shallow(<App />);
  let data = [
    {rating: 0.8, publish_date: "2016-09-05T23:25:47.642350Z", id: "9783221620868", author: "Kaley Schiller"},
    {rating: 3.2, publish_date: "2016-09-04T23:25:47.642388Z", id: "9793364045824", author: "Fay Lemke"}
  ]

  expect(app.instance().getAverageRating(data)).toEqual('2.00');

});
