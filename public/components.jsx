/** @jsx React.DOM */
var CustomerGrid = React.createClass({
  getInitialState: function() {
    console.log("here");
    setTimeout(function(){this.updateUserList();}.bind(this), 0);
    return {data: {customers: []}, firstNameFilter: "", lastNameFilter: "", emailFilter: ""};
  },
  componentDidMount: function() {
  },
  updateUserList: function() {
    var filters = [];
    if (this.state.firstNameFilter != "")
      filters.push({field: "firstName", value: this.state.firstNameFilter});
    if (this.state.lastNameFilter != "")
      filters.push({field: "lastName", value: this.state.lastNameFilter});
    if (this.state.emailFilter != "")
      filters.push({field: "email", value: this.state.emailFilter});
    $.ajax({
      type: "POST",
      contentType: "application/json;charset=UTF-8",
      url: "customer/list",
      data: JSON.stringify({params: {page: 0, pageLength: 10, filters: filters}}),
      dataType: 'json',
      success: function(data) {
        data.onCustomerSelected = this.props.onClick;
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("customer/list", status, err.toString());
      }
    });
  },
  handleRowClick: function(event) {
    // event.currentTarget.rowIndex (starts at 1 and we're offset by 1 because of the filter controls)
    if (this.state.data.onCustomerSelected) {
      this.state.data.onCustomerSelected(this.state.data.customers[event.currentTarget.rowIndex - 2].id);
    }
  },
  handleFirstNameFilterChange: function(event) {
    this.setState({firstNameFilter: event.target.value});
    this.updateUserList();
  },
  handleLastNameFilterChange: function(event) {
    this.setState({lastNameFilter: event.target.value});
    this.updateUserList();
  },
  handleEmailFilterChange: function(event) {
    this.setState({emailFilter: event.target.value});
    this.updateUserList();
  },
  componentDidUpdate: function(prevProps, prevState) {
    if (
      prevState.firstNameFilter != this.state.firstNameFilter ||
      prevState.lastNameFilter != this.state.lastNameFilter ||
      prevState.emailFilter != this.state.emailFilter
    ) {
      this.updateUserList();
    }
  },
  render: function() {
    if (this.state && this.state.data && this.state.data.customers) {
      var customerRows = this.state.data.customers.map(function(customer) {
        return (
          <tr onClick={this.handleRowClick}>
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
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div class="form-group">
                <input type="text" value={this.state.firstNameFilter} onChange={this.handleFirstNameFilterChange} class="form-control" />
              </div>
            </td>
            <td>
              <div class="form-group">
                <input type="text" value={this.state.lastNameFilter} onChange={this.handleLastNameFilterChange} class="form-control" />
              </div>
            </td>
            <td>
              <div class="form-group">
                <input type="text" value={this.state.emailFilter} onChange={this.handleEmailFilterChange} class="form-control" />
              </div>
            </td>
          </tr>
          {customerRows}
        </tbody>
      </table>
    );
  }
});
