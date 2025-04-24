import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import rateLimit from 'express-rate-limit';

import swaggerDocument from '../swagger.json';
import { AccessError, InputError, } from './error';
import {
  assertOwnsGame,
  assertOwnsSession,
  getAnswers,
  getEmailFromAuthorization,
  getGamesFromAdmin,
  getQuestion,
  getResults,
  hasStarted,
  login,
  logout,
  mutateGame,
  playerJoin,
  register,
  save,
  sessionResults,
  sessionStatus,
  submitAnswers,
  updateGamesFromAdmin
} from './service';
import redisAdapter from '../redisAdapter.js';

const app = express();

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: 'Too many requests, please try again later' }
});

// Apply rate limiting to all routes
app.use(limiter);

// Updated CORS configuration
app.use(cors({
  origin: ['https://z5481840-bigbrain-fe-deploy.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Handle OPTIONS requests explicitly with more detailed headers
app.options('*', (req, res) => {
  // These headers are crucial for preflight requests
  const origin = req.header('Origin');
  const allowedOrigins = ['https://z5481840-bigbrain-fe-deploy.vercel.app', 'http://localhost:3000'];
  
  if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Max-Age', '86400'); // 24 hours
  // Immediately respond with 200 OK for preflight
  res.status(200).end();
});

app.use(bodyParser.urlencoded({ extended: true, }));
app.use(bodyParser.json({ limit: '100mb', }));

const catchErrors = fn => async (req, res) => {
  try {
    await fn(req, res);
    save();
  } catch (err) {
    if (err instanceof InputError) {
      res.status(400).send({ error: err.message, });
    } else if (err instanceof AccessError) {
      res.status(403).send({ error: err.message, });
    } else {
      console.log(err);
      res.status(500).send({ error: 'A system error ocurred', });
    }
  }
};

/***************************************************************
                       Auth Functions
***************************************************************/

const authed = fn => async (req, res) => {
  const email = await getEmailFromAuthorization(req.header('Authorization'));
  await fn(req, res, email);
};

app.post('/admin/auth/login', catchErrors(async (req, res) => {
  const { email, password, } = req.body;
  const token = await login(email, password);
  return res.json({ token, });
}));

app.post('/admin/auth/register', catchErrors(async (req, res) => {
  const { email, password, name, } = req.body;
  const token = await register(email, password, name);
  return res.json({ token, });
}));

app.post('/admin/auth/logout', catchErrors(authed(async (req, res, email) => {
  await logout(email);
  return res.json({});
})));

/***************************************************************
                      Game Functions
***************************************************************/
app.get('/admin/games', catchErrors(authed(async (req, res, email) => { 
  const games = await getGamesFromAdmin(email);
  return res.json({ games });
})));

app.put('/admin/games', catchErrors(authed(async (req, res, email) => {
  if (!req.body || !req.body.games) {
    throw new InputError("Request body must contain a 'games' field");
  }

  const { games } = req.body;

  if (!Array.isArray(games)) {
    throw new InputError("Games must be an array");
  }
  await updateGamesFromAdmin({ gamesArrayFromRequest: games, email });
  return res.status(200).send({});
})));

app.post('/admin/game/:gameid/mutate', catchErrors(authed(async (req, res, email) => {
  const { gameid } = req.params;
  await assertOwnsGame(email, gameid);
  const { mutationType } = req.body;
  const data = await mutateGame({
    gameId: gameid,
    mutationType
  });
  return res.status(200).send({ data });
})));

app.get('/admin/session/:sessionid/status', catchErrors(authed(async (req, res, email) => {
  const { sessionid, } = req.params;
  await assertOwnsSession(email, sessionid);
  return res.status(200).json({ results: await sessionStatus(sessionid), });
})));

app.get('/admin/session/:sessionid/results', catchErrors(authed(async (req, res, email) => {
  const { sessionid, } = req.params;
  await assertOwnsSession(email, sessionid);
  return res.status(200).json({ results: await sessionResults(sessionid), });
})));

/***************************************************************
                      Play Functions
***************************************************************/

app.post('/play/join/:sessionid', catchErrors(async (req, res) => {
  const { sessionid, } = req.params;
  const { name, } = req.body;
  const playerId = await playerJoin(name, sessionid);
  return res.status(200).send({ playerId, });
}));

app.get('/play/:playerid/status', catchErrors(async (req, res) => {
  const { playerid, } = req.params;
  return res.status(200).send({ started: await hasStarted(playerid), });
}));

app.get('/play/:playerid/question', catchErrors(async (req, res) => {
  const { playerid, } = req.params;
  return res.status(200).send({ question: await getQuestion(playerid), });
}));

app.get('/play/:playerid/answer', catchErrors(async (req, res) => {
  const { playerid, } = req.params;
  return res.status(200).send({ answers: await getAnswers(playerid), });
}));

app.put('/play/:playerid/answer', catchErrors(async (req, res) => {
  const { playerid, } = req.params;
  const { answers, } = req.body;
  await submitAnswers(playerid, answers);
  return res.status(200).send({});
}));

app.get('/play/:playerid/results', catchErrors(async (req, res) => {
  const { playerid, } = req.params;
  return res.status(200).send(await getResults(playerid));
}));

/***************************************************************
                      Health Check
***************************************************************/

app.get('/health', async (req, res) => {
  try {
    // Check Redis connection
    const redisConnected = await redisAdapter.isConnected();
    
    if (redisConnected) {
      return res.status(200).json({
        status: 'ok',
        redis: 'connected',
        env: process.env.NODE_ENV || 'development',
        uptime: process.uptime()
      });
    } else {
      return res.status(500).json({
        status: 'error',
        redis: 'disconnected',
        message: 'Redis connection failed'
      });
    }
  } catch (error) {
    console.error('Health check error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Unknown error during health check'
    });
  }
});

/***************************************************************
                      Running Server
***************************************************************/

app.get('/', (req, res) => res.redirect('/docs'));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// For Vercel, we export the app
export default app;
