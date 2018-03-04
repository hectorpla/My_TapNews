import './NewsCard.css';

import React from 'react';

class NewsCard extends React.Component {
    redirectToUrl(url, event) {
        event.preventDefault();
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