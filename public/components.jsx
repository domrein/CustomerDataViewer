/** @jsx React.DOM */
var CustomerGrid = React.createClass({
  getInitialState: function() {
    console.log("here");
    return {data: {customers: []}};
  },
  componentDidMount: function() {
    var _this = this;
    $.ajax({
      type: "POST",
      contentType: "application/json;charset=UTF-8",
      url: "customer/list",
      data: JSON.stringify({params: {page: 0, pageLength: 10, filters: []}}),
      dataType: 'json',
      success: function(data) {
        console.log("------");
        console.log(data);
        console.log("------");
        data.onCustomerSelected = _this.props.onClick;
        _this.setState({data: data});
      },
      error: function(xhr, status, err) {
        console.error("customer/list", status, err.toString());
      }
    });
  },
  handleClick: function(event) {
    // console.log(event.target);
    // console.log(this.rowIndex);
  },
  render: function() {
    console.log("render");
    console.log(this.state);
    return (
      <table onClick={this.handleClick} className="table table-striped table-hover">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <CustomerRows data={this.state.data} />
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
    console.log("<this.state>");
    console.log(this.state);
    console.log("</this.state>");
    console.log("<this.props>");
    console.log(this.props);
    console.log("</this.props>");
    if (this.props && this.props.data && this.props.data.customers) {
      var customerRows = this.props.data.customers.map(function(customer) {
        return (
          <tr onClick={this.handleClick}>
            <td>{customer.first_name}</td>
            <td>{customer.last_name}</td>
            <td>{customer.email}</td>
          </tr>
        );
      }, this);
    }
    else {
      customerRows = [];
    }
    return (
      <tbody>
        {customerRows}
      </tbody>
    );
  }
});
