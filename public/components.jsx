/** @jsx React.DOM */
var CustomerGrid = React.createClass({
  getInitialState: function() {
    setTimeout(function(){this.updateUserList();}.bind(this), 0);
    return {page: 0, customers: [], firstNameFilter: "", lastNameFilter: "", emailFilter: ""};
  },

  // fetch the filtered user list from the server
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
      data: JSON.stringify({params: {page: this.state.page, pageLength: this.props.pageLength, filters: filters}}),
      dataType: 'json',
      success: function(data) {
        this.setState({customers: data.customers, numPages: data.numPages});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("customer/list", status, err.toString());
      }
    });
  },
  handleRowClick: function(event) {
    // event.currentTarget.rowIndex (starts at 1 and we're offset by 1 because of the filter controls)
    if (this.props.onCustomerSelected) {
      this.props.onCustomerSelected(this.state.customers[event.currentTarget.rowIndex - 2].id);
    }
  },

  // update state on filter change and reset pagination
  handleFirstNameFilterChange: function(event) {
    this.setState({page: 0, firstNameFilter: event.target.value});
  },
  handleLastNameFilterChange: function(event) {
    this.setState({page: 0, lastNameFilter: event.target.value});
  },
  handleEmailFilterChange: function(event) {
    this.setState({page: 0, emailFilter: event.target.value});
  },

  // refetch customer list when filters/page have been changed
  componentDidUpdate: function(prevProps, prevState) {
    if (
      prevState.firstNameFilter != this.state.firstNameFilter ||
      prevState.lastNameFilter != this.state.lastNameFilter ||
      prevState.emailFilter != this.state.emailFilter ||
      prevState.page != this.state.page
    ) {
      this.updateUserList();
    }
  },
  render: function() {
    // build customer rows
    var customerRows = this.state.customers.map(function(customer) {
      return (
        <tr onClick={this.handleRowClick}>
          <td>{customer.first_name}</td>
          <td>{customer.last_name}</td>
          <td>{customer.email}</td>
        </tr>
      );
    }, this);

    // build pagination
    var pages = [];
    var leftClassName = (this.state.page == 0) ? "disabled" : null;
    var handleLeftClick = function() {
      this.setState({page: 0});
    }.bind(this);
    var handleRightClick = function() {
      this.setState({page: this.state.numPages - 1});
    }.bind(this);
    var rightClassName = (this.state.page == this.state.numPages - 1) ? "disabled" : null;

    // calculate start, end page numbers
    var startPage = this.state.page + 1 - 2;
    if (startPage < 1)
      startPage = 1;
    var endPage = startPage + 4;
    if (endPage > this.state.numPages)
      endPage = this.state.numPages;

    // generate pagination nodes
    for (var i = startPage; i <= endPage; i ++) {
      var activeClassName = null;
      var handlePageClick = function(pageNum) {
        return function(event) {
          this.setState({page: pageNum - 1});
        }.bind(this);
      }.bind(this);
      if (i == this.state.page + 1) {
        activeClassName = "active";
      }
      pages.push(
        <li onClick={handlePageClick(i)} className={activeClassName}><a href="#">{i}</a></li>
      );
    }

    return (
      <div>
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
                <input type="text" value={this.state.firstNameFilter} onChange={this.handleFirstNameFilterChange} className="form-control" />
              </td>
              <td>
                <input type="text" value={this.state.lastNameFilter} onChange={this.handleLastNameFilterChange} className="form-control" />
              </td>
              <td>
                <input type="text" value={this.state.emailFilter} onChange={this.handleEmailFilterChange} className="form-control" />
              </td>
            </tr>
            {customerRows}
          </tbody>
        </table>
        <div className="text-center">
          <ul className="pagination">
            <li onClick={handleLeftClick} className={leftClassName}><a href="#">&laquo;</a></li>
            {pages}
            <li onClick={handleRightClick} className={rightClassName}><a href="#">&raquo;</a></li>
          </ul>
        </div>
      </div>
    );
  }
});
