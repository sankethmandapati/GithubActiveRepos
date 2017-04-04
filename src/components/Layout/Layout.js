/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Layout.css';
import Header from '../Header';
import Feedback from '../Feedback';
import Footer from '../Footer';

class Layout extends React.Component {
  constructor(props) {
    // console.log("constructor")
    super(props);
    this.state = {
      keyWord: "",
      searchResults: []
    };
    this.callApi = this.callApi.bind(this);
    this.keyPressed = this.keyPressed.bind(this);
  }

  componentDidMount() {
    var intervalId = setInterval(() => {
      if(this.state.keyWord != "") {
        this.callApi();
      } else {
        this.setState({searchResults: []});
      }
    }, 10000);
    this.setState({intervalId: intervalId});
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  async callApi() {
    try {
      let response = await fetch('https://api.github.com/search/repositories?q=' + this.state.keyWord + '&sort=forks&order=desc', {
        method: 'GET',
        headers: {
          "Accept": "application/vnd.github.mercy-preview+json"
          // "Authorization" : "token" + OAUTH-TOKEN
        }
      });
      let responseJson = await response.json();
      if(response.status == 200) {
        this.setState({searchResults: responseJson.items});
      } else {
        console.log("error in getting the data...");
      }
      // console.log("responseJson: ", responseJson);
    } catch(err) {
      console.log("error: ", err);
    }
  }

  keyPressed(event) {
    this.setState({keyWord: event.target.value}, function() {
      if(this.state.keyWord != "") {
        this.callApi();
      } else {
        this.setState({searchResults: []});
      }
    });
  }

  render() {
    return (
      <div>
        Enter KeyWord to search most active Git Repositories: <input placeholder="Enter Key Word" type="text" value={this.state.keyWord} onChange={this.keyPressed} />
        <h1>Search Results: </h1>
        {
          this.state.searchResults.map((item, n) => {
            return (
              <div style={{marginLeft: 25}} key={n}>
                <a target="_blank" href={item.url}><h3>{item.full_name}</h3></a>
                <p>Name: {item.name}</p>
                <p>Clone Url: {item.clone_url}</p>
                <p>Description: {item.description}</p>
                <p>Number Of Forks: {item.forks_count}</p>
              </div>
            )
          })
        }
      </div>
    );
  }
}

//// <button onClick={this.callApi}>Click Here</button>

export default withStyles(s)(Layout);
