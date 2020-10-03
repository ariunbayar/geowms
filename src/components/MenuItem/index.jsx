import React from "react";
import { NavLink } from "react-router-dom";

const MenuItem = (props) => {
  return (
    <li>
      <NavLink
      exact={true}
      className="waves-effect"
      activeClassName="active"
      to={props.url}
    >
      {props.children}
    </NavLink>
    </li>
  );
};

export default MenuItem;
