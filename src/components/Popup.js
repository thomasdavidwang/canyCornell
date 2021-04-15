import React from "react";
import Button from 'react-bootstrap/Button'
import close_logo from "./close.svg"

const Popup = props => {
  return (
    <div className="popup-box">
      <div className="box">
        <Button className="p-1 float-right" variant="custom2" id='close'
          onClick={props.handleClose}>
          <img className="close" src={close_logo} alt="close" />
        </Button>
        {props.content}
      </div>
    </div>
  );
};

export default Popup;
