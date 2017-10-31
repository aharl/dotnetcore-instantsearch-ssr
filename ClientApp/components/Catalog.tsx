// product images at https://5c66e53e70f99ca62de4-b9cf175ae397b1f6ec307e00a3d10107.ssl.cf5.rackcdn.com/B318A.jpg
// TODO: hook into routing
// https://community.algolia.com/react-instantsearch/guide/Routing.html

import * as React from "react";
import { Configure, Hits, SearchBox } from "react-instantsearch/dom";
import { withRouter, RouteComponentProps } from "react-router-dom";

import Hit from "./Hit";

class Catalog extends React.Component<RouteComponentProps<ICatalogProps>, {}> {
  // dynamic title with
  // https://community.algolia.com/react-instantsearch/connectors/connectStateResults.html
  public render() {
    return (
      <div className="catalog container">
        <Configure hitsPerPage="15" />
        <SearchBox />
        <Hits component={Hit} />
      </div>
    );
  }
}

export default withRouter(Catalog);
