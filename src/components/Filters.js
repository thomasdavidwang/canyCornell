import React from "react";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { filters: [] };
  }

  componentDidMount() {
    this.changeFilters()
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.filters !== prevProps.filters) {
      this.changeFilters()
      console.log(prevProps.filters)
      console.log(this.props.filters)
    }
  }

  changeFilters() {
    this.setState({
      filters: this.props.filters
    });
  }

  render() {
    return (
      this.state.filters.map((filter) =>
        <div className="filter-item w-75 text-center p-1 my-1">
          {filter}
        </div>)
    )
  }
}
export default App;