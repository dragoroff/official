import React, { Component } from 'react';
import {Card, CardImg, CardText, CardBody, CardGroup, CardSubtitle, CardTitle,
        Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import {Button, FormGroup, FormControl, Form} from 'react-bootstrap';

class Book extends Component {
    constructor(props){
      super(props);
      this.state = {
          modal: false,
          modalDelete: false,
          currentImg: this.props.volumeInfo.imageLinks,
          dateError: false,
          emptyField: false,
          duplicateTitle: false
      }
      this.toggle = this.toggle.bind(this);
      this.toggleDelete = this.toggleDelete.bind(this);
      this.imageHandler = this.imageHandler.bind(this);
      this.editHandler = this.editHandler.bind(this);
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    toggleDelete = () => {
        this.setState({
            modalDelete: !this.state.modalDelete
        });
    }

    imageHandler = () => {
        this.setState({
            currentImg: this.imageLinks.value
        });
    }

    editHandler = (event) => {
        event.preventDefault();
        let date = this.publishedDate.value.slice(0,4);
        let currentDate = new Date().getFullYear();
        if (Number(date) > currentDate || this.publishedDate.value === ""){
            return this.setState({dateError: true, emptyField: false});
        }
        if (this.title.value.length === 0 || this.authors.value.length === 0){
            return this.setState({emptyField: true, dateError: false});
        }
        else {
            this.setState({dateError: false, modal: false, emptyField: false});
            return this.props.onEdit(this.title.value, this.authors.value, this.publishedDate.value, this.imageLinks.value, this.props.volumeInfo.id);
        }
  }

    deleteHandler = (id) => {
        this.setState({
            modalDelete: false
        })
        this.props.onDelete(id);
  }

render(){
    const {title, authors, imageLinks, publishedDate, id} = this.props.volumeInfo;
    let validation = (title) => {
        title = title.replace(/[^A-Za-z 0-9 .]/g, "");
        return title.replace(/\w\S*/g, (text) => {
            return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
        });
    }
    return (
      <div>
          <CardGroup>
                <Card style={{marginBottom: '15px'}}>
                    <CardImg className="img" top width="100%" src={imageLinks} alt="" />
                        <CardBody>
                            <CardTitle>
                            {
                                validation(title.length > 15 ? title.slice(0,15) + "..." : title)
                            }
                            </CardTitle>
                            <CardSubtitle>
                            {authors ? authors.map(x=>{
                                return `${x} `
                            }):"No author"}
                            </CardSubtitle>
                            <CardText>{publishedDate}</CardText>
                            <Button bsStyle="success" className="button" onClick={this.toggle}>
                                <span style={{marginRight:"10px", marginLeft:"10px"}}>Edit</span>
                            </Button>
                            <Button bsStyle="danger" className="button" onClick={this.toggleDelete}>Delete</Button>
                        </CardBody>
                    </Card>
            </CardGroup>

            <Modal isOpen={this.state.modalDelete} toggle={this.toggleDelete}>
            <ModalBody>
                Are you sure you want to delete {title}?
            </ModalBody>
            <ModalFooter>
                <Button bsStyle="success" className="button" onClick={this.deleteHandler.bind(this, id)}>Submit</Button>
                <Button bsStyle="danger" className="button" onClick={this.toggleDelete}>Cancel</Button>
            </ModalFooter>
            </Modal>

            <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}/>
                            <Form onSubmit={this.editHandler} inline>
                            <ModalBody>
                            <p className="lead">
                                Please fill in all fields to change your personal details
                            </p>
                            {
                                this.state.dateError ? <p className="alert alert-danger">Date must be earlier than current date</p> : null
                            }
                            {
                                this.state.emptyField ? <p className="alert alert-danger">There must be at least 1 character in the field</p> : null
                            }
                                <FormGroup>
                                     <FormControl  className="col-10 form" inputRef={inputValue=>this.title = inputValue} defaultValue={title}/>
                                </FormGroup>
                                <FormGroup>
                                    <FormControl className="col-10 form" inputRef={inputValue=>this.authors = inputValue} defaultValue={authors}/>
                                </FormGroup>
                                <FormGroup>
                                    <FormControl className="col-10 form" type="date" inputRef={inputValue=>this.publishedDate = inputValue} defaultValue={publishedDate}/>
                                </FormGroup>
                                <FormGroup>
                                    <FormControl className="col-10" onChange={this.imageHandler} inputRef={inputValue=>this.imageLinks = inputValue} defaultValue={imageLinks}/>
                                </FormGroup>
                                <div className="picture-box">
                                    <img className="picture" alt="" src={this.state.currentImg}/>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button bsStyle="success" className="button" type="submit">Submit</Button>
                                <Button bsStyle="danger" className="button" onClick={this.toggle}>Cancel</Button>
                            </ModalFooter>
                            </Form>
                </Modal>
      </div>
    );
  }
}

export default Book;