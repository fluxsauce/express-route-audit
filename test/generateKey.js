import test from 'ava';
import ERA from '..';

test.before((t) => {
  t.context.route = '/index';
  t.context.method = 'post';
});

test('generateKey should throw on an invalid route', (t) => {
  t.plan(2);
  const error = t.throws(() => {
    ERA.generateKey(undefined, undefined);
  });

  t.is(error.message, 'generateKey: invalid route!');
});

test('generateKey should throw on an invalid method', (t) => {
  t.plan(2);
  const error = t.throws(() => {
    ERA.generateKey('/', undefined);
  });

  t.is(error.message, 'generateKey: invalid method!');
});

test('generateKey normalize methods', (t) => {
  t.plan(2);
  t.deepEqual(ERA.generateKey(t.context.route, 'POST'), `${t.context.route}|post`);
  t.deepEqual(ERA.generateKey(t.context.route, 'gET'), `${t.context.route}|get`);
});

test('generateKey normalize routes', (t) => {
  t.plan(2);
  t.deepEqual(ERA.generateKey('/INDEX', 'POST'), `${t.context.route}|${t.context.method}`);
  t.deepEqual(ERA.generateKey('/iNdEx', 'POST'), `${t.context.route}|${t.context.method}`);
});
