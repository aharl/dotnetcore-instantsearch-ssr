import * as React from "react";

interface IHitProps {
  hit: ISearchHit;
}

class Hit extends React.Component<IHitProps, {}> {
  public render() {
    return (
      <div>
        <p>{this.props.hit.name}</p>
      </div>
    );
  }
}

export default Hit;
