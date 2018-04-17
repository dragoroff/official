import React, { Component } from 'react';
import {Button, Form, FormControl, Grid, Col, Row} from 'react-bootstrap';
import './App.css'

class AddPerson extends Component {
constructor(props){
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
}
onSubmit = (event) => {
    event.preventDefault();
    let id = Math.random() * 100;
    let picture;
    this.picture.value ? picture = this.picture.value : picture = "https://forums.roku.com/styles/canvas/theme/images/no_avatar.jpg"
    this.props.onSubmit(
        this.name.value, this.address.value, this.phone.value, picture, id
    );
    this.name.value = ""; 
    this.address.value = ""; 
    this.phone.value = "";
    this.picture.value = ""
}
  render() {
    return (
      <div className="add">
          <Grid className="grid">
            <Row>
                <Col xs={2} md={0.5}/>
                <Col xs={14} md={11}>
                    <Form onSubmit={this.onSubmit} inline style={{marginLeft: '1%'}}>
                            <FormControl className="FormControl" placeholder="name" inputRef={inputValue=>this.name = inputValue} required/>
                            <FormControl className="FormControl" placeholder="address" inputRef={inputValue=>this.address = inputValue} required/>
                            <FormControl className="FormControl" placeholder="phone" inputRef={inputValue=>this.phone = inputValue} required/>
                            <FormControl className="FormControl" placeholder="picture" inputRef={inputValue=>this.picture = inputValue}/>
                            <Button className="button" type="submit" bsStyle="success">+Add new user</Button>
                    </Form>
                </Col>
                <Col xs={2} md={0.5}/>
            </Row>
          </Grid>
      </div>
    );
  }
}

export default AddPerson;