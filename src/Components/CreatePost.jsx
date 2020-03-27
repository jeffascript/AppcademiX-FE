import React, { Component } from 'react';
import { Button, Col, Row, Fade, Container, Form, FormGroup, Label, Input } from 'reactstrap';
import { withRouter } from "react-router-dom"


class CreatePost extends Component {
    state = {
        title: "",
        description: "",
        link: "",
        difficulty: "",
        category: "",
        selectedFile: null,
        uploadFileChecker: false
    }

    render() {
        return (
            <Fade>
                <Container className="create-post">
                    <Row>
                        <Col>
                            <Form onSubmit={this.submitPost}>
                                <FormGroup>
                                    <Label>Title</Label>
                                    <Input type="text" onChange={(e) => this.setState({ title: e.target.value })} value={this.state.title} required></Input>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Description</Label>
                                    <Input type="textarea" onChange={(e) => this.setState({ description: e.target.value })} value={this.state.description} required ></Input>
                                </FormGroup>
                                {/* <FormGroup>
                                    <Label>Link</Label>
                                    <Input type="url" onChange={(e) => this.setState({ link: e.target.value })} value={this.state.link} required></Input>
                                </FormGroup> */}
                                <FormGroup>
                                    <Label>Difficulty</Label>
                                    <Input type="select" onChange={(e) => this.setState({ difficulty: e.target.value })} value={this.state.difficulty} required>
                                        <option>-</option>
                                        <option>Easy</option>
                                        <option>Medium</option>
                                        <option>Hard</option>
                                    </Input>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Category</Label>
                                    <Input type="select" onChange={(e) => this.setState({ category: e.target.value })} value={this.state.category} required>
                                        <option>-</option>
                                        <option>Tech</option>
                                        <option>Sales</option>
                                        <option>Productivity</option>
                                        <option>Other</option>
                                    </Input>
                                </FormGroup>

                                <FormGroup>
                                    <Label className="btn btn-primary">Upload Image
                                        <Input type="file" onChange={(val) => this.setState({ selectedFile: val.target.files[0], uploadFileChecker: true })} ></Input>
                                    </Label>
                                    <span>  {this.state.selectedFile && this.state.selectedFile.name || this.state.selectedFile}</span>
                                </FormGroup>
                                <Button className="btn-modal-primary">Create Post</Button>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </Fade>
        );
    }


    componentDidMount = () => {
        console.log("mounteed with data", this.props.data)


        this.setState({
            link: this.props.link,
            title: this.props.data.title,
            description: this.props.data.description,
            selectedFile: this.props.data.image

        })


    }


    // componentDidUpdate= (prevProps, prevState) =>{
    //     console.log("mounteed with data",this.props.data)
    //     if(prevProps.data !== this.props.data){

    //         this.setState({
    //             title: this.props.title,
    //             description: this.props.description,
    //             selectedFile: this.props.image

    //         })

    //     }
    // }




    submitPost = async (e) => {
        e.preventDefault()
        let post = {
            title: this.state.title,
            description: this.state.description,
            difficulty: this.state.difficulty,
            category: this.state.category,
            link: this.state.link,
            image: this.state.selectedFile
        }
        try {
            let response = await fetch("http://localhost:9000/api/posts/" + localStorage.getItem("username"), {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("access_token"),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(post)
            })
            if (this.state.selectedFile && this.state.uploadFileChecker) {
                let post = await response.json()
                console.log(post)
                let id = post.newPost._id
                let fd = new FormData();
                fd.append("postImage", this.state.selectedFile)
                let fileUploaded = await fetch("http://localhost:9000/api/posts/image/" + id + "/" + localStorage.getItem("username"), {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("access_token")
                    },
                    body: fd
                })
            }
            if (response.ok) {
                this.props.history.push("/")
            }
            else
                console.log("Error")
        } catch (e) {
            console.log(e)
        }

        this.props.history.push("/")
    }
}

export default withRouter(CreatePost);