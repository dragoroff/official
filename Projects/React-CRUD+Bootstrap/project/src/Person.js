import React, { Component } from 'react';
import {Button, Grid, Col, Row, Form, FormControl} from 'react-bootstrap';
import {FormGroup, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import './App.css'

class Person extends Component {
    constructor(props){
        super(props);
        this.state = {
            modal: false,
            img: this.props.picture
        }
        this.imageHandler = this.imageHandler.bind(this);
        this.editHandler = this.editHandler.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    imageHandler = () => {
        this.setState({
            img: this.picture.value
        });
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    onDelete = (id) => {
        this.props.onDelete(id);
  }

    editHandler = (event) => {
        event.preventDefault();
        this.props.onEdit(
            this.name.value, this.address.value, this.phone.value, this.picture.value, this.props.id
    )
  }

  render() {
      const {name, address, phone, picture, id} = this.props;
    return (
      <div>
          <Grid className="grid">
                    <Row>
                    <Col xs={3} md={2}>
                        {name} 
                    </Col>
                    <Col xs={3} md={2}>
                        {address}
                    </Col>
                    <Col xs={3} md={3}>
                        {phone} 
                    </Col>
                    <Col xs={3} md={2}>
                        <img src={picture} alt=""/>
                    </Col>
                    <Col xs={6} md={3}>
                        <Button 
                            bsStyle="success" className="button" onClick={this.toggle}>
                                Update
                        </Button>
                        <Button bsStyle="danger" className="button" onClick={this.onDelete.bind(this, id)}>Delete</Button>
                    </Col>
                    </Row>
                </Grid>
          <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}/>
                            <Form onSubmit={this.editHandler} inline>
                            <ModalBody>
                            <p className="lead">
                                Please fill in all fields to change your personal details
                            </p>
                                <FormGroup>
                                     <FormControl  className="col-md-10" placeholder="name" inputRef={inputValue=>this.name = inputValue} defaultValue={name} required/>
                                </FormGroup>
                                <FormGroup>
                                    <FormControl className="col-md-10" placeholder="address" inputRef={inputValue=>this.address = inputValue} defaultValue={address} required/>
                                </FormGroup>
                                <FormGroup>
                                    <FormControl className="col-md-10" placeholder="phone" inputRef={inputValue=>this.phone = inputValue} defaultValue={phone} required/>
                                </FormGroup>
                                <FormGroup>
                                    <FormControl className="col-md-10" placeholder="picture" onChange={this.imageHandler} inputRef={inputValue=>this.picture = inputValue} defaultValue={picture} required/>
                                </FormGroup>
                                <div className="picture-box">
                                    <img className="picture" alt="" src={this.state.img}/>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button bsStyle="success" className="button" onClick={this.toggle} type="submit">Save</Button>
                                <Button bsStyle="danger" className="button" onClick={this.toggle}>Cancel</Button>
                            </ModalFooter>
                            </Form>
                </Modal>
      </div>
    );
  }
}

export default Person;
