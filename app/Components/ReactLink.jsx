import React from 'react';
import { Link } from 'react-router-dom';

export class ReactLink extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    if (/^https?:\/\//.test(this.props.to))
      return (
        <a href={this.props.to} {...this.props} target='_blanc'>
          {this.props.children}
        </a>)
        ;

    return (
      <Link to={this.props.to} {...this.props}>
        {this.props.children}
      </Link>
    );
  }
};