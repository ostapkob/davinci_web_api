<script>
  import Card, { Content, Actions } from "@smui/card";
  import IconButton, { Icon } from "@smui/icon-button";

  export let model;
  export let timestamp;
  export let temperature;
  export let maxTokens;
  export let prompt;
  export let answer;
  export let index;
  export let removeItem;

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp); // Convert string to date object
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Add 1 to month as it is zero-indexed and pad with '0'
    const day = String(date.getDate()).padStart(2, "0"); // Pad the day with '0'
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0"); // Pad the minute with '0'
    const formattedDate = `${month}-${day} ${hour}:${minute}`;
    return formattedDate;
  }
</script>

<section style="margin-top: 10px">
  <div class="card-container">
    <Card>
      <Content>
        <div class="container">
          <small class="red"> {`t = ${temperature}`} </small>
          <small class="gray"> {formatTimestamp(timestamp)} </small>
        </div>
        <div class="prompt">{prompt}</div>
        <div>{answer}</div>
        <div class="flexy">
          <IconButton
            toggle
            aria-label="Add to favorites"
            title="Add to favorites"
          >
            <Icon class="material-icons" on>favorite</Icon>
            <Icon class="material-icons">favorite_border</Icon>
          </IconButton>
          <IconButton
            class="material-icons"
            on:click={() => removeItem(index)}
            title="Delete">delete</IconButton
          >
        </div>
      </Content>
    </Card>
  </div>
</section>

<style>
  .gray {
    color: gray;
    text-align: right;
    order: 2;
    margin-right: 16px;
  }
  .red {
    color: #ff3e00;
    text-align: left;
    order: 1;
  }
  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .prompt {
    color:gray;
    margin-bottom: 10px;
}
</style>
