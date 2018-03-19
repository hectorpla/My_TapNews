import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

import NewsCard from '../NewsCard/NewsCard';
import Auth from '../Auth/Auth';

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
        if (!Auth.isAuthenticated()) {
            
            // TODO: redirect to login page
            this.context.router.history.replace('/login');
            return;
        }

        const url = `http://${window.location.hostname}:3000/news`;
        const request = new Request(url, {
            method: 'POST', // TODO: authorization bearer header
            headers: { // otherwise the server would not understand
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: Auth.getEmail(),
                token: Auth.getToken()
            })
        });
        fetch(request)
            .then(res => {
                if (res.status === 200) {
                    return res.json();
                }
                console.log("some error happened!", res);
                // TODO: not authenticated or server error; redirect to login page?
                Auth.deAuthenticate();
                this.context.router.history.replace('/login')
                
            })
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
                <div className='list-group'>
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

NewsPanel.contextTypes = {
    router: PropTypes.object.isRequired
}

export default NewsPanel;