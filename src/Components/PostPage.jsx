import React, { Component } from 'react';
import PostsList from './PostsList';
import TodayList from './TodayPosts';
import YesterdayPosts from './YesterdayPosts';
import OldPosts from './OldPosts';

class PostPage extends Component {
    state = {
        posts: []
    }
    render() {
        return (
            <div>
                <TodayList posts={this.state.posts} />
                <YesterdayPosts posts={this.state.posts} />
                <OldPosts posts={this.state.posts} />
                <PostsList posts={this.state.posts} />
            </div>
        );
    }

    componentDidMount = async() => { 
      await this.fetchPosts()
    }


    fetchPosts = async () => {
        let response = await fetch("http://localhost:9000/api/posts?sort=ratingsCount")
        let posts = await response.json()
        const newPosts = posts.postsList

        setTimeout(() => {
            this.setState({
                posts: newPosts.sort(function (a, b) { return b.ratingsCount - a.ratingsCount})
               })
        }, 200);
    }
}

export default PostPage;