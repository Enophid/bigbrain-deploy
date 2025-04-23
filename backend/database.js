import { createClient } from "redis"

const client = createClient ({
  url : "rediss://default:ATuZAAIjcDFjMGZhY2IyMmNjN2Y0NWFhYjY3YTA1YmMxZDY0YWVhZHAxMA@adequate-treefrog-15257.upstash.io:6379"
});

client.on("error", function(err) {
  throw err;
});
await client.connect()
await client.set('foo','bar');