/** @jsx React.DOM */
var CustomerGrid = React.createClass({
  handleClick: function(event) {
    // console.log(event.target);
    // console.log(this.rowIndex);
  },
  render: function() {
    return (
      <table onClick={this.handleClick} className="table table-striped table-hover">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <CustomerRows data={this.props.data} />
      </table>
    );
  }
});

var CustomerRows = React.createClass({
  handleClick: function(event) {
    console.log(event);
    // event.currentTarget.rowIndex (starts at 1)
    if (this.props.data.onCustomerSelected) {
      this.props.data.onCustomerSelected(this.props.data.customers[event.currentTarget.rowIndex - 1].id);
    }
    // populate customer editor with customer data
  },
  render: function() {
    var customerRows = this.props.data.customers.map(function(customer) {
      return (
        <tr onClick={this.handleClick}>
          <td>{customer.firstName}</td>
          <td>{customer.lastName}</td>
          <td>{customer.email}</td>
        </tr>
        // <CustomerRow firstName={customer.firstName}, >
        //   {comment.text}
        // </CustomerRow>
      );
    }, this);
    return (
      <tbody>
        {customerRows}
      </tbody>
    );
  }
});

React.renderComponent(
  <CustomerGrid data={data} />,
  document.getElementById('customerGridContainer')
);
