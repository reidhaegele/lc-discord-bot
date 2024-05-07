const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token, channels, leetcodeEndpoint, dailyQuery } = require('./config.json');
const cron = require('node-cron');
const http = require('http');

const hostname = '0.0.0.0';
const port = process.env.PORT;

//Host http server to confirm status for App engine status checks
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('The server has started');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

const fetchDailyCodingChallenge = async () => {
    console.log(`Fetching daily coding challenge from LeetCode API.`)
    const init = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: dailyQuery }),
    }

    const response = await fetch(leetcodeEndpoint, init)
    return response.json()
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

async function createForumPost() {
    // Fetch daily coding challenge from LeetCode API
    const data = await fetchDailyCodingChallenge();
    if (!data || !data.data || !data.data.activeDailyCodingChallengeQuestion) {
        console.error(JSON.stringify(data) + ' - Failed to fetch daily coding challenge from LeetCode API.');
        return;
    }

    const question = data.data.activeDailyCodingChallengeQuestion.question;
    const title = question.frontendQuestionId + ". " + question.title;
    const link = "https://leetcode.com" + data.data.activeDailyCodingChallengeQuestion.link;
    const description = `# [Link](${link})\nDate: ${data.data.activeDailyCodingChallengeQuestion.date}\nDifficulty: ${question.difficulty}`;

    //Loop through channels listed in config file
    for (const key in channels) {
        const forumChannel = client.channels.cache.get(channels[key]);
        
        if (!forumChannel) {
            console.error('Invalid channel ID');
            return;
        }

        // Check if the channel is a forum
        if (forumChannel.type !== 15) {
            console.error(forumChannel.type+' - Channel does not support threads');
            return;
        }

        // Create the forum thread
        forumChannel.threads.create({
            name: title,
            message: {
                content: description
            },
            reason: 'New forum post'
        })
        .then(threadChannel => console.log('Forum post created successfully:', threadChannel))
        .catch(error => console.error('Error creating forum post:', error));
    }
}

client.once(Events.ClientReady, readyClient => {
    console.log(`Logged in as ${readyClient.user.tag}`);
    cron.schedule('0 19 * * *', () => {
        console.log('Creating Forum Post');
        createForumPost();
    }, {
        timezone: "America/Chicago" //US Central Standard Time
    });
    // createForumPost();
});

client.login(token);