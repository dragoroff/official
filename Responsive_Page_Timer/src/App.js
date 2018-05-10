import React, { Component } from 'react';
import './App.css';
import logo from './assets/logo.png';
import {Button} from 'reactstrap';
import {Grid, Col, Row} from 'react-bootstrap'

class App extends Component {
  constructor(props){
    super(props);
    this.state = {photos: 0, percent: 0, size: 0}
  }

  timer = (status, seconds) => {
    var count = 0;
    let interval = setInterval(()=>{
      if(seconds>count && status==="photo"){
        count++;
        return this.setState({
          photos: this.state.photos + 1
        });
      }
      if(seconds>count && status==="percent"){
        count++;
        return this.setState({
          percent: this.state.percent + 1
        });
      }
      if(seconds>count && status==="size"){
        count++;
        var num = 0.33;
        var random = Math.random()*0.15;
        return this.setState({
          size: (num+count+random).toFixed(2)
        });
      }
      else{
        this.setState({
          size: 14.44
        })
        clearInterval(interval);
      }
    }, 1000)
  }
  componentDidMount(){
    this.timer('photo', 60);
    this.timer('percent', 49);
    this.timer('size', 14);
  }
  render() {
    return (
      <div className="app">
          <div id="wrapper" className="wrapper">
            <div id="left" className="left">
              <div className="mainPart">
                  <img className="logo" src={logo} alt=""/>
                      <p id="mainHeader" className="mainHeader">
                        Look deep inside the inner sanctuary of your soul.
                      </p>
                      <p id="description" className="description">
                        Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, 
                        there live the blind texts.
                      </p> 
                  <Button id="button" className="border border-light text-light" color="secondary" outline>Start a free trial</Button>
               </div>
              </div>
        <div className="right">
        <Grid>
          <Row>
            <Col md={4} sm={2} />
              <div id="circle" className="circle">
                <Grid>
                  <Row className="smaller-elements">
                    <Col md={2} sm={2} className="col-1"/>
                    <Col md={4} sm={4} className="col-5">
                      <p>{this.state.photos}</p>
                      <p className="photos">PHOTOS</p>
                    </Col>
                    <Col md={3} sm={3} className="percents col-1">
                      <p>{this.state.percent}%</p>
                      <p className="smaller">SMALLER</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={3} sm={3}/>
                    <Col md={3} sm={4} className="mbites">
                      <p>
                        {this.state.size}
                        <span className="lead">MB</span></p>
                      <p className="lead savings">SAVINGS</p>
                    </Col>
                    <Col md={3} sm={6}/>
                  </Row>
                  </Grid>
              </div>
              </Row>
            </Grid>
            </div>
          </div>
      </div>
    );
  }
}

export default App;
