import React, { Component } from "react";
import gql from "graphql-tag";
import { graphql } from "react-apollo";

class LyricCreate extends Component {
  constructor(props) {
    super(props);

    this.state = { content: "" };
  }

  onSubmit(event) {
    const { mutate, songId } = this.props;
    const { content } = this.state;

    event.preventDefault();

    mutate({
      variables: {
        content,
        songId
      }
    }).then(() => this.setState({ content: "" }));
  }
  render() {
    const { content } = this.state;
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <label>Add a Lyric</label>
        <input
          value={content}
          onChange={event => this.setState({ content: event.target.value })}
        />
      </form>
    );
  }
}

const mutation = gql`
  mutation AddLyric($content: String, $songId: ID) {
    addLyricToSong(content: $content, songId: $songId) {
      id
      title
      lyrics {
        content
        id
        likes
      }
    }
  }
`;

export default graphql(mutation)(LyricCreate);
