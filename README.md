# Leetcode Discord Bot
This Discord bot fetches the daily Leetcode question and posts it in your server's forum.
<br><br><br>

![image](https://github.com/reidhaegele/lc-discord-bot/assets/37484165/d4723062-bfc1-4979-b3b9-8b0c78f41578)
<br>*Forum post automatically posted by Leetcode-Daily bot*


### Usage
- Create a [Discord Developer account](https://discord.com/developers/applications)
- Create a new Discord bot
- Copy bot token (NOT THE SECRET) by hitting "Reset Token"
![image](https://github.com/reidhaegele/lc-discord-bot/assets/37484165/1bdcd082-b9fa-428d-914b-d254c8372697)

- Go to OAuth and select applications.commands and bot roles
- Copy and paste link into browser to invite your bot to your server
- Ensure your Discord server is a community server with a forum channel created
- Clone this repo using `git clone`
- Create a `config.json` file with the following (Replace anything in UPPERCASE):
```json
{
	"token": "YOUR_TOKEN",
    "channels": {
        "CHANNE_LNAME": "THE NUMBERS FROM COPYING CHANNEL ID",
        "OPTIONAL_2ND_CHANNEL_NAME": "THE NUMBERS FROM COPYING CHANNEL ID"
    },
    "leetcodeEndpoint": "https://leetcode.com/graphql",
    "dailyQuery": "query questionOfToday {activeDailyCodingChallengeQuestion {date userStatus link question { acRate difficulty freqBar frontendQuestionId: questionFrontendId isFavor paidOnly: isPaidOnly status title titleSlug hasVideoSolution hasSolution topicTags {name id slug}}}}"
}
```
- If testing by running locally, comment out the cron job at the end of `index.js` and uncomment the `createForumPost();` function call. This will instantly create the forum post rather than schedule it.
- To run locally, open your terminal and navigate to the directory where you cloned this repo. Ensure that you have [NodeJS](https://nodejs.org/en/download) installed. Run `npm i`, then run `node index.js`. Check your Discord server to see if the post appeared.
- To run it in Google Cloud with scheduled jobs, see the following:
- The cron.schedule line near the end of the `index.js` file controls what time the post is scheduled for daily. Edit this using the [cron format](https://www.ibm.com/docs/en/db2oc?topic=task-unix-cron-format#d64890e371).
- Install [Google Cloud CLI](https://cloud.google.com/sdk/docs/install)
- Run `gcloud init`
- Run `gcloud app deploy`
