import React from 'react';
import _ from 'lodash';

import NewsCard from '../NewsCard/NewsCard'

class NewsPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {news : null};
    }

    scrollHandler() {
        const scroll_y = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        if ((scroll_y + window.innerHeight) >= document.body.offsetHeight + 20) {
            // console.log(`${scroll_y} + ${window.innerHeight} = ${scroll_y + window.innerHeight} ? ${document.body.offsetHeight}`)
            console.log('scroll handler: ...')
            this.loadMoreNews();
        }
    }    

    componentDidMount() {
        this.loadMoreNews();
        this.loadMoreNews = _.debounce(this.loadMoreNews, 1000);
        window.addEventListener('scroll', () => this.scrollHandler()); // closure neccessary here
    }

    loadMoreNews() {
        const url = `http://${window.location.hostname}:3000/news`;
        const request = new Request(url, {method: 'GET'});
        fetch(request)
            .then(res => res.json())
            .then(new_list => {
                this.setState({news: this.state.news == null ? 
                    new_list : this.state.news.concat(new_list)}
            )});
    }

    renderNews() {
        const news_list = this.state.news.map(news => {
            return (
                <a className='list-group-item' key={news.digest} href="#">
                    <NewsCard news={news} />
                </a>
            )
        })

        return (
            <div className="container-fluid">
                <div class='list-group'>
                    {news_list}
                </div>
            </div>
        )
    }

    render() {
        if (this.state.news) {
            return(
                <div>
                    {this.renderNews()}
                </div>
            )
        }
        return (
            <div> loading... </div>
        )
    }
}

export default NewsPanel;