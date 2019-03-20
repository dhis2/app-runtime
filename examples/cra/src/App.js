import React, { Component } from "react";
import "./App.css";
import { DataRequest } from "@dhis2/app-service-data";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h3>Indicators (first 10)</h3>
          <DataRequest resourcePath="indicators.json?order=shortName:desc&pageSize=10">
            {({ loading, error, data }) => {
              console.log(loading, error, data);
              if (loading) return <span>...</span>;
              if (error) return <span>{`ERROR: ${error.message}`}</span>;
              return (
                <pre>
                  {data.indicators.map(ind => ind.displayName).join("\n")}
                </pre>
              );
            }}
          </DataRequest>
        </header>
      </div>
    );
  }
}

export default App;
