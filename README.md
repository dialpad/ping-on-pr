An action that sends a text message to a Dialpad channel when a PR is assigned to a review team.

This action uses the Dialpad public API (see: https://developers.dialpad.com). You must get an API key and create a github secret to use this.

This action should be called by a workflow on the pull_request review_requested event.

Building
```
ncc build index.js
```

Sample workflow
```
on:
  pull_request:
    types: [review_requested]

jobs:
  ping_on_pr_job:
    runs-on: ubuntu-latest
    name: Ping on PR
    steps:
      - name: Ping on PR action step
        uses: dialpad/ping-on-pr@v1.0
        id: ping-on-pr
        with:
          api-key: ${{ secrets.<YOUR API KEY SECRET NAME> }}
          user-id: '<YOUR USER ID>'
          review-teams-and-channels: '{"<YOUR REVIEW TEAM NAME>": "<YOUR CHANNEL HASHTAG>"}'
```
