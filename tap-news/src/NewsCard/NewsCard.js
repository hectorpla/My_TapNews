import './NewsCard.css';

import React from 'react';
import Auth from '../Auth/Auth';

class NewsCard extends React.Component {
    redirectToUrl(url, event) {
        event.preventDefault();
        console.log(`news was clicked, titled as ${this.props.news.title}`);
        let click_log_request_url = 
            `${window.location.origin}/news/click-log/userId/${Auth.getEmail()}/newsDigest/${this.props.news.digest}`;

        console.log(click_log_request_url);
        let request = new Request(encodeURI(click_log_request_url), {
            headers: {
                'Authorization': 'Bearer ' + Auth.getToken()
            }
        })
        fetch(request)
            .then((res) => console.log('click sent successfully'))
        window.open(url, '_blank');
    }

    render() {
        return (
            <div className="news-container" 
                onClick={(e) => this.redirectToUrl(this.props.news.url, e)}>
                    <div className="row">
                        <div className="col s6 fill"> 
                            <img src={this.props.news.urlToImage} alt="" />
                        </div>
                        <div className="col s6">
                            <h4> { this.props.news.title } </h4>
                            <p className="pull-right"> { this.props.news.source } </p>
                            <div> {this.props.news.description} </div>
                        </div>
                    </div>
            </div>
        )
    }
}

export default NewsCard;