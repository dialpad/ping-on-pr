const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

const run = async () => {

	const reviewTeamsAndChannels = JSON.parse(core.getInput('review-teams-and-channels'));
	const apiKey = core.getInput('api-key');
	const userId = core.getInput('user-id');

	// 0. Verify that the action type is review requested.
	if (github.context.payload.action != 'review_requested') {
		console.log("Action type was not review requested. Ignoring.");
		return;
	}

	// 1. Verify that we have a requested team and a channel mapping for it.
	const team = github.context.payload.requested_team;
	if (!team) {
		console.log("Review wasn't requested to a team. Ignoring.");
		return;
	}
	const channel = reviewTeamsAndChannels[team.slug];
	if (!channel) {
		// No channel configured. Just return.
		console.log(`No channel for team: ${team.slug}`);
		return;
	}

	// 2. Send the text message to the channel.
	const pullRequest = github.context.payload.pull_request;
	const data = {
		channel_hashtag: channel,
		text: `[New pull request from ${pullRequest.user.login}] ${pullRequest.title} (${pullRequest.html_url})`,
		user_id: userId,
	};
	const config = {headers: {'Authorization': `Bearer ${apiKey}`}};
	console.log(data);
	await axios.post( 'https://dialpad.com/api/v2/sms', data, config);
}

run().catch((error) => {
	if (error.response) {
		console.error(error.response);
	}
	core.setFailed(error.message);
});