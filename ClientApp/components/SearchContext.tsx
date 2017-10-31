import * as React from "react";
import { createInstantSearch } from "react-instantsearch/server";
import * as qs from "qs";
import { throttle } from "lodash";
import { withRouter, RouteComponentProps } from "react-router-dom";

const { InstantSearch, findResultsState } = createInstantSearch();

interface ISearchContextProps {
  resultsState?: any;
}

declare interface ICatalogState {
  searchState: ISearchState;
}

type Props = RouteComponentProps<{}> & ISearchContextProps;

class SearchContext extends React.Component<Props, ICatalogState> {
  private updateURL = throttle((searchState: ISearchState) => {
    this.props.history.push(this.searchStateToURL(searchState), searchState);
  }, 1000);

  constructor(props: Props) {
    super(props);
    this.state = {
      searchState: this.parseURLToSearchState()
    };
  }
  public render() {
    console.log("results state");
    console.log(this.props.resultsState);

    return (
      <InstantSearch
        appId="V1R4XUPH9W"
        apiKey="ad1a91907b1587dff50cce0032543809"
        indexName="products"
        searchState={this.state.searchState}
        onSearchStateChange={this.onSearchStateChange}
        createURL={this.createURL}
        resultsState={this.props.resultsState || {}}
      >
        {this.props.children}
      </InstantSearch>
    );
  }

  private parseURLToSearchState = (): ISearchState => {
    if (this.props.location.pathname.startsWith("/catalog", 0)) {
      const urlList = this.props.location.pathname.slice(9).split("/");
      const category1 = urlList
        .map(
          item => item.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())
          // Undo to lowercase
        )
        .join(" > ");
      const query = qs.parse(this.props.location.search.slice(1));
      // ugg
      const menuValues = { ...query };
      delete menuValues.p;
      delete menuValues.q;
      // ---
      const newSearchState: ISearchState = {
        hierarchicalMenu: {
          category1
        },
        menu: { ...menuValues },
        query: query.q,
        page: query.p || 1
      };
      return newSearchState;
    }
    return {};
  };
  private createURL = (searchState: ISearchState) => {
    let newURL = "";
    if (this.props.location.pathname.startsWith("/catalog", 0)) {
      if (searchState.hierarchicalMenu) {
        const categories = searchState.hierarchicalMenu.category1.split(" > ");
        const prettycats = categories.map(category =>
          encodeURI(category.replace(/\s/g, "-").toLowerCase())
        );

        newURL += `${prettycats[0] ? "/" + prettycats[0] : ""}${prettycats[1]
          ? "/" + prettycats[1]
          : ""}${prettycats[2] ? "/" + prettycats[2] : ""}`;
      }
      const newSearch = {
        ...searchState.menu,
        q: searchState.query,
        p: searchState.page
      };
      newURL += `?${qs.stringify(newSearch, { encode: false })}`;
    }
    return newURL;
  };

  private searchStateToURL = (searchState: ISearchState) => {
    if (this.props.location.pathname.startsWith("/catalog", 0)) {
      return searchState ? `/catalog${this.createURL(searchState)}` : "";
    }
    return "";
  };

  private onSearchStateChange = (searchState: ISearchState) => {
    // if (searchState.menu) {
    //   console.log(searchState.menu);
    // }
    if (this.props.location.pathname.startsWith("/catalog", 0)) {
      this.updateURL(searchState);
    }
    this.setState({
      searchState
    });
  };
}

export { findResultsState };
export default withRouter<ISearchContextProps>(SearchContext);
