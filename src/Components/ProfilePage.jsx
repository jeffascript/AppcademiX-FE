import React, { Component } from 'react';
import { Container, Col, Row, Fade } from 'reactstrap'
import PostsList from './PostsList';
import FontAwesome from 'react-fontawesome';
import { withRouter } from 'react-router-dom'
import EditInfoModal from './EditInfoModal';

class ProfilePage extends Component {
    state = {
        profile: undefined,
        posts: [],
        openEditInfo: false
    }
    render() {
        return (
            <div>
                {this.state.profile &&
                    <Fade>
                        <Container className="profile">
                            <Row>
                                <Col className="col-sm-4 col-md-3 col-l-2">
                                    <img className="profile-img" src={this.state.profile.image} alt="Profile Pic" />
                                </Col>
                                <Col>
                                    <div className="profile-info ml-1">
                                        <h4>{this.capFirst(this.state.profile.firstname) + " " + this.capFirst(this.state.profile.lastname)}</h4>
                                        <h6 style={{ color: "#666" }}>{"@" + this.state.profile.username}</h6>
                                    </div>
                                    {this.props.match.params.username === localStorage.getItem("username") && <span className="icon" onClick={() => this.toggleEditInfo()}><FontAwesome name="edit" /></span>}
                                </Col>
                            </Row>
                        </Container>
                        {this.state.openEditInfo && <EditInfoModal open={this.state.openEditInfo} toggle={this.toggleEditInfo} />}
                        {this.state.posts && this.state.posts.length > 0
                            ?
                            <PostsList posts={this.state.posts} nrefresh={this.initialFetcher} />
                            :
                                <span className="center-msg">No Posts</span>
                            }
                    </Fade>
                }
            </div>
        );
    }

    initialFetcher = async () => {
        try {
            let response = await fetch("http://localhost:9000/api/users/" + this.props.match.params.username)
            if (response.status === 500)
                this.props.history.push("/")
            let profile = await response.json()
            console.log(profile)
            response = await fetch("http://localhost:9000/api/posts/username/" + this.props.match.params.username)
            let posts = await response.json()
            posts.sort(function (a, b) { return b.ratings.length - a.ratings.length })
            this.setState({
                profile: profile,
                posts: posts
            })
        } catch (e) {
            console.log(e)
        }
    }

    componentDidMount = async () => {
        await this.initialFetcher()
    }

    capFirst = string => {
        if (string)
            return string.charAt(0).toUpperCase() + string.slice(1)
    }

    componentDidUpdate = async(prevProps, prevStates) => {
        if(prevProps.match.params.username !== this.props.match.params.username)
            await this.initialFetcher()
    }

    toggleEditInfo = (update) => {
        this.setState({ openEditInfo: !this.state.openEditInfo })
        if (update !== undefined && update.firstname !== undefined && update.lastname !== undefined)
            this.setState({
                profile: {
                    ...this.state.profile,
                    firstname: update.firstname,
                    lastname: update.lastname,
                    image: update.image
                }
            })
    }
}

export default /* connect(mapStateToProps, mapDispatchToProps) */ProfilePage;

