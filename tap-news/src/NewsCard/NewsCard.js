import './NewsCard.css';

import React from 'react';
import Auth from '../Auth/Auth';

class NewsCard extends React.Component {
    redirectToUrl(url, event) {
        event.preventDefault();
        console.log(`news was clicked, titled as ${this.props.news.title}`);

        // mind two things: 1, start with 'http'; 2. port number (also gets through on 3001)
        let click_log_request_url = 
            `http://${window.location.hostname}:3000/news/click-log/userId/${Auth.getEmail()}/newsDigest/${this.props.news.digest}`;

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
                            <div className="row">
                                { this.props.news.category && <span className="badge yellow"> {this.props.news.category} </span> }
                                { this.props.news.recommended && <span className="badge green"> Recommended </span> }
                                { this.props.news.relativeTime && <span className="badge blue"> {this.props.news.relativeTime} </span> }
                                <span> { this.props.news.source } </span>
                            </div>
                            <div className="row"> {this.props.news.description} </div>
                        </div>
                    </div>
            </div>
        )
    }
}

export default NewsCard;