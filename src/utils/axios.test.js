import { axios, handleError, handleUrl, loadUserInfo, handleData, mock, getType } from './axios';

// https://www.npmjs.com/package/msw
// 在单元测试中模拟数据mock请求
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// umi test ./src/utils/axios.test.js  --runInBand --detectOpenHandles
// --no-cache --inspect --watch
const mockData = {
  rows: 2,
};
const server = setupServer(
  rest.get('https://api.cbpc.ltd/mock', (req, res, ctx) => res(ctx.json(mockData))),
  rest.post('https://api.cbpc.ltd/post', (req, res, ctx) => res(ctx.json(mockData))),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const readData = () =>
  axios({
    url: 'https://api.cbpc.ltd/mock',
  }).then((res) => res.rows);

test('handle url', () => {
  expect(handleUrl({ url: './test.json' })).toMatchObject({
    url: 'http://localhost:8000/test.json',
  });
});

test('resolve', () =>
  axios({
    url: 'https://api.cbpc.ltd/mock',
  }).then((res) => {
    expect(res.rows).toBeGreaterThan(0);
  }));

test('reject', () => {
  expect(
    axios({
      url: 'http://localhost:8000/3/e4e497e849_err_token',
    }),
  ).rejects.toMatchObject({
    message: '请求错误',
    description: 'Network Error',
    url: 'http://localhost:8000/3/e4e497e849_err_token?',
    params: {},
  });
});

test('服务端数据读写', () => {
  expect(readData()).resolves.toBeGreaterThan(0);
});

test('post', () => {
  // expect.assertions(1);
  expect(
    axios({
      method: 'post',
      url: 'https://api.cbpc.ltd/post',
      data: {
        id: 3,
        nonce: 'e4e497e849',
      },
    }).then((res) => res.rows),
  ).resolves.toBeGreaterThan(0);
});

test('401', async () => {
  server.use(rest.post('https://api.cbpc.ltd/post', (req, res, ctx) => res(ctx.status(401))));
  const res = await axios({
    method: 'post',
    url: 'https://api.cbpc.ltd/post',
    data: {
      id: 3,
      nonce: 'e4e497e84943',
    },
  }).catch((e) => e);
  expect(res).toMatchSnapshot();
});

test('错误处理', () => {
  let req = {
    config: {
      url: 'https://api.cbpc.ltd/get',
    },
    response: {
      data: {
        msg: 401,
      },
      status: 401,
    },
  };

  expect(handleError(req)).toMatchSnapshot();

  req = { description: '', message: '请求错误', params: {}, url: 'www.cdyc.cbpm' };

  expect(handleError(req)).toMatchSnapshot();

  req = {
    config: {
      params: '{"id":1,"nonce":2,}',
      response: {
        status: 401,
      },
      url: '1',
    },
    message: 'msg',
  };

  expect(handleError(req)).toMatchSnapshot();

  req = {
    config: {
      params: '{"id":1,"nonce":2,}',
      response: {
        status: 901,
      },
      url: null,
    },
    message: 'msg',
  };

  expect(handleError(req)).toMatchSnapshot();

  req = {
    request: '请求出错',
  };
  expect(handleError(req)).toMatchSnapshot();

  req = {
    message: '内容出错',
  };
  expect(handleError(req)).toMatchSnapshot();
});

test('loadUserInfo', () => {
  const user = loadUserInfo(null);
  expect(user.token.split('.')).toHaveLength(3);
  expect(loadUserInfo(JSON.stringify({ token: 'token' })).token.split('.')).toHaveLength(3);
});

test('handleData', () => {
  const data = { token: 'token', rows: 1 };
  expect(handleData({ data })).toMatchObject({ rows: 1 });
  expect(handleData({ data: { rows: 1 } })).toMatchObject({ rows: 1 });
});

test('mock', () => {
  // mock增加require后会报循环调用的错误，同时打包会存在问题，故取消，只允许传数据
  expect(mock('a', 1000)).resolves.toBe('a');
  expect(mock({ rows: 2 })).resolves.toMatchObject({ rows: 2 });
});

test('gettype', () => {
  expect(getType({})).toBe('object');
});
